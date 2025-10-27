import { describe, it, expect, vi, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useCaseStore } from './caseStore';
import axios from 'axios';

// Mock接口定义以避免类型错误
interface MockCase {
  id: string;
  caseNumber: string;
  patientName: string;
  diagnosis?: any[];
  [key: string]: any;
}

// Mock axios
vi.mock('axios');
const mockedAxios = vi.mocked(axios);

describe('caseStore', () => {
  let caseStore: any;
  
  beforeEach(() => {
    // 创建新的pinia实例
    setActivePinia(createPinia());
    
    // 重置mocks
    mockedAxios.get.mockReset();
    mockedAxios.post.mockReset();
    mockedAxios.put.mockReset();
    mockedAxios.delete.mockReset();
    
    // 创建case store
    caseStore = useCaseStore();
  });
  
  describe('initial state', () => {
    it('should have correct initial state', () => {
      expect(caseStore.cases).toEqual([]);
      expect(caseStore.currentCase).toEqual({});
      expect(caseStore.loading).toBe(false);
      expect(caseStore.error).toBe(null);
      expect(caseStore.pagination).toEqual({
        page: 1,
        pageSize: 10,
        total: 0
      });
    });
  });
  
  describe('fetchCases', () => {
    it('should fetch cases successfully', async () => {
      // Mock API response
      const mockCases = [
        { id: '1', caseNumber: 'C001', patientName: 'John Doe' },
        { id: '2', caseNumber: 'C002', patientName: 'Jane Smith' }
      ];
      
      mockedAxios.get.mockResolvedValue({
        data: {
          code: 200,
          data: {
            records: mockCases,
            total: 2,
            page: 1,
            pageSize: 10
          }
        }
      });
      
      // 调用fetchCases
      await caseStore.fetchCases({ page: 1, pageSize: 10 });
      
      // 验证API调用
      expect(mockedAxios.get).toHaveBeenCalledWith('/api/cases', {
        params: { page: 1, pageSize: 10 }
      });
      
      // 验证状态更新
      expect(caseStore.cases).toEqual(mockCases);
      expect(caseStore.pagination.total).toBe(2);
      expect(caseStore.loading).toBe(false);
      expect(caseStore.error).toBe(null);
    });
    
    it('should handle fetch cases error', async () => {
      // Mock API error
      const errorMessage = 'Failed to fetch cases';
      mockedAxios.get.mockRejectedValue(new Error(errorMessage));
      
      // 调用fetchCases
      await caseStore.fetchCases({ page: 1, pageSize: 10 });
      
      // 验证状态更新
      expect(caseStore.cases).toEqual([]);
      expect(caseStore.loading).toBe(false);
      expect(caseStore.error).toBe(errorMessage);
    });
  });
  
  describe('getCaseDetail', () => {
    it('should get case detail successfully', async () => {
      // Mock API response
      const mockCase = {
        id: '1',
        caseNumber: 'C001',
        patientName: 'John Doe',
        diagnosis: []
      };
      
      mockedAxios.get.mockResolvedValue({
        data: {
          code: 200,
          data: mockCase
        }
      });
      
      // 调用getCaseDetail
      await caseStore.getCaseDetail('1');
      
      // 验证API调用
      expect(mockedAxios.get).toHaveBeenCalledWith('/api/cases/1');
      
      // 验证状态更新
      expect(caseStore.currentCase).toEqual(mockCase);
      expect(caseStore.loading).toBe(false);
      expect(caseStore.error).toBe(null);
    });
  });
  
  describe('createCase', () => {
    it('should create case successfully', async () => {
      // Mock API response
      const newCase = {
        id: '3',
        caseNumber: 'C003',
        patientName: 'New Patient'
      };
      
      mockedAxios.post.mockResolvedValue({
        data: {
          code: 200,
          data: newCase
        }
      });
      
      // 调用createCase
      const result = await caseStore.createCase(newCase);
      
      // 验证API调用
      expect(mockedAxios.post).toHaveBeenCalledWith('/api/cases', newCase);
      
      // 验证结果
      expect(result).toEqual(newCase);
      expect(caseStore.loading).toBe(false);
      expect(caseStore.error).toBe(null);
    });
  });
  
  describe('updateCase', () => {
    it('should update case successfully', async () => {
      // Mock API response
      const updatedCase = {
        id: '1',
        caseNumber: 'C001',
        patientName: 'Updated Name'
      };
      
      mockedAxios.put.mockResolvedValue({
        data: {
          code: 200,
          data: updatedCase
        }
      });
      
      // 调用updateCase
      const result = await caseStore.updateCase('1', updatedCase);
      
      // 验证API调用
      expect(mockedAxios.put).toHaveBeenCalledWith('/api/cases/1', updatedCase);
      
      // 验证结果
      expect(result).toEqual(updatedCase);
      expect(caseStore.currentCase).toEqual(updatedCase);
      expect(caseStore.loading).toBe(false);
      expect(caseStore.error).toBe(null);
    });
  });
  
  describe('deleteCase', () => {
    it('should delete case successfully', async () => {
      // Mock API response
      mockedAxios.delete.mockResolvedValue({
        data: {
          code: 200,
          message: 'Case deleted successfully'
        }
      });
      
      // 设置初始状态
      caseStore.cases = [
        { id: '1', caseNumber: 'C001', patientName: 'John Doe' },
        { id: '2', caseNumber: 'C002', patientName: 'Jane Smith' }
      ];
      
      // 调用deleteCase
      await caseStore.deleteCase('1');
      
      // 验证API调用
      expect(mockedAxios.delete).toHaveBeenCalledWith('/api/cases/1');
      
      // 验证状态更新 - 案例已从列表中删除
      expect(caseStore.cases).toEqual([
        { id: '2', caseNumber: 'C002', patientName: 'Jane Smith' }
      ]);
      expect(caseStore.loading).toBe(false);
      expect(caseStore.error).toBe(null);
    });
  });
  
  describe('batchDeleteCases', () => {
    it('should batch delete cases successfully', async () => {
      // Mock API response
      mockedAxios.post.mockResolvedValue({
        data: {
          code: 200,
          message: 'Cases deleted successfully',
          data: { success: true, count: 2 }
        }
      });
      
      // 设置初始状态
      caseStore.cases = [
        { id: '1', caseNumber: 'C001', patientName: 'John Doe' },
        { id: '2', caseNumber: 'C002', patientName: 'Jane Smith' },
        { id: '3', caseNumber: 'C003', patientName: 'Third Patient' }
      ];
      
      // 调用batchDeleteCases
      const result = await caseStore.batchDeleteCases(['1', '2']);
      
      // 验证API调用
      expect(mockedAxios.post).toHaveBeenCalledWith('/api/cases/batch-delete', {
        ids: ['1', '2']
      });
      
      // 验证结果
      expect(result).toEqual({ success: true, count: 2 });
      
      // 验证状态更新 - 案例已从列表中删除
      expect(caseStore.cases).toEqual([
        { id: '3', caseNumber: 'C003', patientName: 'Third Patient' }
      ]);
    });
  });
});