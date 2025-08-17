export interface Repository<T> {
  findAll(): Promise<T[]>;
  findById(id: string): Promise<T | null>;
  create(data: Omit<T, 'id' | 'created_at' | 'updated_at'>): Promise<T>;
  update(id: string, data: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
  search?(query: string): Promise<T[]>;
}

export abstract class BaseRepository<T extends { id: string; created_at: string; updated_at: string }> implements Repository<T> {
  abstract findAll(): Promise<T[]>;
  abstract findById(id: string): Promise<T | null>;
  abstract create(data: Omit<T, 'id' | 'created_at' | 'updated_at'>): Promise<T>;
  abstract update(id: string, data: Partial<T>): Promise<T | null>;
  abstract delete(id: string): Promise<boolean>;
  abstract search?(query: string): Promise<T[]>;

  protected generateId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  protected getCurrentTimestamp(): string {
    return new Date().toISOString();
  }
}

export { BaseRepository }