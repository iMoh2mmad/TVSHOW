import fs from 'fs/promises';
import path from 'path';
import { BaseRepository } from './base';
import { Movie, Series, Person, Subtitle, ScraperConfig } from '../types';

const DATA_DIR = path.join(process.cwd(), 'data');

class JsonRepository<T extends { id: string; created_at: string; updated_at: string }> extends BaseRepository<T> {
  constructor(private filename: string) {
    super();
  }

  private async ensureDataDir() {
    try {
      await fs.access(DATA_DIR);
    } catch {
      await fs.mkdir(DATA_DIR, { recursive: true });
    }
  }

  private async readData(): Promise<T[]> {
    await this.ensureDataDir();
    const filepath = path.join(DATA_DIR, this.filename);
    
    try {
      const data = await fs.readFile(filepath, 'utf-8');
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  private async writeData(data: T[]): Promise<void> {
    await this.ensureDataDir();
    const filepath = path.join(DATA_DIR, this.filename);
    await fs.writeFile(filepath, JSON.stringify(data, null, 2));
  }

  async findAll(): Promise<T[]> {
    return await this.readData();
  }

  async findById(id: string): Promise<T | null> {
    const data = await this.readData();
    return data.find(item => item.id === id) || null;
  }

  async create(itemData: Omit<T, 'id' | 'created_at' | 'updated_at'>): Promise<T> {
    const data = await this.readData();
    const now = this.getCurrentTimestamp();
    
    const item = {
      ...itemData,
      id: this.generateId(),
      created_at: now,
      updated_at: now,
    } as T;

    data.push(item);
    await this.writeData(data);
    return item;
  }

  async update(id: string, updates: Partial<T>): Promise<T | null> {
    const data = await this.readData();
    const index = data.findIndex(item => item.id === id);
    
    if (index === -1) return null;

    const updated = {
      ...data[index],
      ...updates,
      id,
      updated_at: this.getCurrentTimestamp(),
    };

    data[index] = updated;
    await this.writeData(data);
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    const data = await this.readData();
    const index = data.findIndex(item => item.id === id);
    
    if (index === -1) return false;

    data.splice(index, 1);
    await this.writeData(data);
    return true;
  }

  async search(query: string): Promise<T[]> {
    const data = await this.readData();
    const lowerQuery = query.toLowerCase();
    
    return data.filter(item => {
      const searchableFields = Object.values(item).filter(value => 
        typeof value === 'string'
      ) as string[];
      
      return searchableFields.some(field => 
        field.toLowerCase().includes(lowerQuery)
      );
    });
  }
}

// Repository instances
export const movieRepository = new JsonRepository<Movie>('movies.json');
export const seriesRepository = new JsonRepository<Series>('series.json');
export const personRepository = new JsonRepository<Person>('people.json');
export const subtitleRepository = new JsonRepository<Subtitle>('subtitles.json');
export const scraperConfigRepository = new JsonRepository<ScraperConfig>('scraper-configs.json');