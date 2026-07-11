import crypto from 'crypto';

const stores = new Map();

class QueryBuilder {
  constructor(model, query = {}) {
    this.model = model;
    this.query = query;
    this.sortSpec = null;
  }

  sort(sortSpec) {
    this.sortSpec = sortSpec;
    return this;
  }

  then(resolve, reject) {
    return this.exec().then(resolve, reject);
  }

  catch(reject) {
    return this.exec().catch(reject);
  }

  async exec() {
    const items = this.model._findMany(this.query);
    if (this.sortSpec) {
      const entries = Object.entries(this.sortSpec);
      const sorted = [...items].sort((a, b) => {
        for (const [key, direction] of entries) {
          const aValue = a[key];
          const bValue = b[key];
          if (aValue === bValue) continue;
          return direction === -1 ? (aValue > bValue ? -1 : 1) : (aValue < bValue ? -1 : 1);
        }
        return 0;
      });
      return sorted;
    }
    return items;
  }
}

class Model {
  constructor(name, schema = {}) {
    this.name = name;
    this.schema = schema;
    if (!stores.has(name)) {
      stores.set(name, []);
    }
    this._store = stores.get(name);
  }

  _clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  _matches(item, query = {}) {
    return Object.entries(query).every(([key, expected]) => {
      if (expected && typeof expected === 'object' && !Array.isArray(expected) && '$gt' in expected) {
        return item[key] > expected.$gt;
      }
      if (expected && typeof expected === 'object' && !Array.isArray(expected) && '$in' in expected) {
        return expected.$in.includes(item[key]);
      }
      if (expected === undefined) return true;
      return item[key] === expected;
    });
  }

  _findMany(query = {}) {
    return this._store.filter((item) => this._matches(item, query));
  }

  async create(payload) {
    const doc = {
      _id: crypto.randomUUID(),
      ...this._clone(payload),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this._store.push(doc);
    return this._clone(doc);
  }

  async find(query = {}) {
    return new QueryBuilder(this, query);
  }

  async findOne(query = {}) {
    const item = this._findMany(query)[0];
    return item ? this._clone(item) : null;
  }

  async findById(id) {
    const item = this._store.find((entry) => entry._id === id);
    if (!item) return null;
    const doc = this._clone(item);
    return {
      ...doc,
      select: (fields) => {
        if (!fields) return doc;
        const projection = fields.startsWith('-') ? fields.slice(1).split(/\s+/).filter(Boolean) : fields.split(/\s+/).filter(Boolean);
        const result = { ...doc };
        if (fields.startsWith('-')) {
          for (const field of projection) delete result[field];
        } else {
          for (const key of Object.keys(result)) {
            if (!projection.includes(key)) delete result[key];
          }
        }
        return result;
      }
    };
  }

  async findByIdAndUpdate(id, update = {}, _options = {}) {
    const index = this._store.findIndex((entry) => entry._id === id);
    if (index === -1) return null;
    const updated = { ...this._store[index], ...this._clone(update), updatedAt: new Date() };
    this._store[index] = updated;
    return this._clone(updated);
  }

  async countDocuments() {
    return this._store.length;
  }

  async bulkWrite(operations) {
    for (const op of operations) {
      if (op.updateOne) {
        const { filter, update } = op.updateOne;
        const items = this._findMany(filter);
        for (const item of items) {
          const index = this._store.findIndex((entry) => entry._id === item._id);
          if (index === -1) continue;
          const next = { ...this._store[index] };
          for (const [field, change] of Object.entries(update.$inc || {})) {
            next[field] = (next[field] || 0) + change;
          }
          next.updatedAt = new Date();
          this._store[index] = next;
        }
      }
    }
    return { acknowledged: true };
  }
}

export function createModel(name, schema) {
  return new Model(name, schema);
}
