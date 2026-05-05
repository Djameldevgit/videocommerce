// 📁 client/src/data/dataSync.js
export class DataSyncManager {
    constructor() {
      this.cache = new Map();
      this.lastUpdate = null;
    }
  
    async syncWithBackend(endpoint = '/api/brands-models') {
      try {
        const response = await fetch(endpoint);
        const data = await response.json();
        
        this.updateCache(data);
        this.lastUpdate = new Date();
        
        console.log('✅ Datos sincronizados con backend:', data);
        return data;
      } catch (error) {
        console.error('❌ Error sincronizando con backend:', error);
        return this.getCachedData();
      }
    }
  
    updateCache(data) {
      this.cache.set('brands', data.brands || {});
      this.cache.set('models', data.models || {});
      localStorage.setItem('marketplace_data', JSON.stringify({
        cache: Object.fromEntries(this.cache),
        lastUpdate: this.lastUpdate
      }));
    }
  
    getCachedData() {
      const stored = localStorage.getItem('marketplace_data');
      if (stored) {
        const parsed = JSON.parse(stored);
        this.cache = new Map(Object.entries(parsed.cache));
        this.lastUpdate = parsed.lastUpdate;
      }
      return {
        brands: this.cache.get('brands') || {},
        models: this.cache.get('models') || {}
      };
    }
  
    smartFind(query, type = 'brand', category = null) {
      const data = type === 'brand' 
        ? this.cache.get('brands')
        : this.cache.get('models');
  
      if (!data) return [];
  
      return this.searchAlgorithm(query, data, category);
    }
  
    searchAlgorithm(query, data, category) {
      const results = [];
      const queryLower = query.toLowerCase();
  
      for (const [catKey, catData] of Object.entries(data)) {
        if (category && catKey !== category) continue;
  
        if (typeof catData === 'object') {
          for (const [subKey, items] of Object.entries(catData)) {
            items.forEach(item => {
              if (item.toLowerCase().includes(queryLower)) {
                results.push({
                  item,
                  category: catKey,
                  subCategory: subKey,
                  relevance: this.calculateRelevance(item, queryLower)
                });
              }
            });
          }
        }
      }
  
      return results
        .sort((a, b) => b.relevance - a.relevance)
        .map(r => r.item);
    }
  
    calculateRelevance(item, query) {
      if (item.toLowerCase().startsWith(query)) return 100;
      if (item.toLowerCase().includes(query)) return 50;
      return 10;
    }
  }
  
  // Exportar instancia única (Singleton)
  export const dataSync = new DataSyncManager();