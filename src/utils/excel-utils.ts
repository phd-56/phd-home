import * as XLSX from 'xlsx';

/**
 * Excel工具类，提供Excel文件的解析、生成等功能
 */
export class ExcelUtils {
  /**
   * 将JSON数据转换为Excel文件
   * @param data 要转换的JSON数据
   * @param sheetName Excel工作表名称
   * @param fileName 导出文件名
   * @param header 自定义表头映射，格式: { key: '显示名称' }
   */
  static exportJsonToExcel(
    data: any[],
    sheetName: string = 'Sheet1',
    fileName: string = 'export.xlsx',
    header?: Record<string, string>
  ): void {
    if (!data || data.length === 0) {
      console.error('No data to export');
      return;
    }

    // 处理表头
    let headers: string[] = [];
    let dataKeys: string[] = [];

    if (header) {
      // 使用自定义表头
      dataKeys = Object.keys(header);
      headers = dataKeys.map(key => header[key]);
    } else {
      // 从数据中提取表头
      dataKeys = Object.keys(data[0]);
      headers = [...dataKeys];
    }

    // 准备工作表数据
    const wsData = [headers];
    
    // 添加数据行
    data.forEach(item => {
      const rowData = dataKeys.map(key => {
        const value = item[key];
        
        // 处理特殊类型数据
        if (value instanceof Date) {
          return value.toISOString().split('T')[0]; // 日期格式化为YYYY-MM-DD
        } else if (Array.isArray(value)) {
          return value.join(', '); // 数组转换为逗号分隔的字符串
        } else if (typeof value === 'object' && value !== null) {
          return JSON.stringify(value); // 对象转换为JSON字符串
        }
        
        return value !== undefined && value !== null ? value : '';
      });
      
      wsData.push(rowData);
    });

    // 创建工作表和工作簿
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName);

    // 导出文件
    XLSX.writeFile(wb, fileName);
  }

  /**
   * 解析Excel文件为JSON数据
   * @param file Excel文件对象
   * @param headerRow 表头所在行索引，默认为0
   * @param hasHeader 是否包含表头行
   * @returns 解析后的JSON数据
   */
  static async parseExcelToJson(
    file: File,
    headerRow: number = 0,
    hasHeader: boolean = true
  ): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];

          // 转换为JSON
          const jsonData = XLSX.utils.sheet_to_json(worksheet, {
            header: hasHeader ? 'A' : 1,
            raw: false,
            dateNF: 'yyyy-mm-dd',
            defval: ''
          });

          if (!hasHeader) {
            resolve(jsonData);
            return;
          }

          // 处理表头
          const headers: string[] = [];
          const headerRowData = jsonData[headerRow];
          
          // 提取表头文本
          for (const key in headerRowData) {
            if (Object.prototype.hasOwnProperty.call(headerRowData, key)) {
              headers.push(headerRowData[key]);
            }
          }

          // 处理数据行
          const result: any[] = [];
          jsonData.slice(headerRow + 1).forEach((rowData: any) => {
            const row: Record<string, any> = {};
            
            // 将列索引映射到表头
            for (const key in rowData) {
              if (Object.prototype.hasOwnProperty.call(rowData, key)) {
                const colIndex = parseInt(key.replace(/[A-Z]/g, '')) - 1;
                const headerName = headers[colIndex];
                
                if (headerName) {
                  row[headerName] = rowData[key];
                }
              }
            }
            
            result.push(row);
          });

          resolve(result);
        } catch (error) {
          console.error('Error parsing Excel file:', error);
          reject(new Error('解析Excel文件失败: ' + (error as Error).message));
        }
      };

      reader.onerror = () => {
        console.error('File read error');
        reject(new Error('读取文件失败'));
      };

      reader.readAsArrayBuffer(file);
    });
  }

  /**
   * 从Excel文件中读取指定工作表
   * @param file Excel文件对象
   * @param sheetIndex 工作表索引，默认为0
   * @returns 工作表数据
   */
  static async readExcelSheet(
    file: File,
    sheetIndex: number = 0
  ): Promise<{
    headers: string[];
    data: any[];
    sheetName: string;
  }> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          
          if (sheetIndex >= workbook.SheetNames.length) {
            reject(new Error(`工作表索引 ${sheetIndex} 超出范围`));
            return;
          }
          
          const sheetName = workbook.SheetNames[sheetIndex];
          const worksheet = workbook.Sheets[sheetName];
          
          // 获取所有单元格地址
          const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1:A1');
          
          // 提取表头（第一行）
          const headers: string[] = [];
          for (let c = range.s.c; c <= range.e.c; c++) {
            const cellAddress = XLSX.utils.encode_cell({ r: 0, c });
            const cell = worksheet[cellAddress];
            headers.push(cell ? cell.v : `Column${c + 1}`);
          }
          
          // 提取数据行
          const rows: any[] = [];
          for (let r = 1; r <= range.e.r; r++) {
            const row: any = {};
            for (let c = range.s.c; c <= range.e.c; c++) {
              const cellAddress = XLSX.utils.encode_cell({ r, c });
              const cell = worksheet[cellAddress];
              
              if (cell) {
                // 根据单元格类型处理值
                switch (cell.t) {
                  case 'n': // 数字
                    row[headers[c]] = cell.v;
                    break;
                  case 's': // 字符串
                    row[headers[c]] = cell.v;
                    break;
                  case 'b': // 布尔值
                    row[headers[c]] = cell.v;
                    break;
                  case 'd': // 日期
                    row[headers[c]] = new Date(cell.v * 24 * 60 * 60 * 1000);
                    break;
                  default:
                    row[headers[c]] = cell.v || '';
                }
              } else {
                row[headers[c]] = '';
              }
            }
            rows.push(row);
          }
          
          resolve({ headers, data: rows, sheetName });
        } catch (error) {
          console.error('Error reading Excel sheet:', error);
          reject(new Error('读取工作表失败: ' + (error as Error).message));
        }
      };

      reader.onerror = () => {
        reject(new Error('读取文件失败'));
      };

      reader.readAsArrayBuffer(file);
    });
  }

  /**
   * 验证Excel文件格式是否符合模板要求
   * @param file Excel文件对象
   * @param requiredHeaders 必需的表头列表
   * @param sheetIndex 工作表索引
   * @returns 验证结果
   */
  static async validateExcelTemplate(
    file: File,
    requiredHeaders: string[],
    sheetIndex: number = 0
  ): Promise<{
    valid: boolean;
    missingHeaders?: string[];
    error?: string;
  }> {
    try {
      const { headers } = await this.readExcelSheet(file, sheetIndex);
      
      // 检查是否缺少必需的表头
      const missingHeaders = requiredHeaders.filter(
        header => !headers.some(h => h.trim().toLowerCase() === header.trim().toLowerCase())
      );
      
      if (missingHeaders.length > 0) {
        return {
          valid: false,
          missingHeaders
        };
      }
      
      return { valid: true };
    } catch (error) {
      return {
        valid: false,
        error: (error as Error).message
      };
    }
  }

  /**
   * 将JSON数据转换为工作表对象
   * @param data JSON数据
   * @param header 表头映射
   * @returns 工作表对象
   */
  static jsonToSheet(data: any[], header?: Record<string, string>): XLSX.WorkSheet {
    if (!data || data.length === 0) {
      return XLSX.utils.aoa_to_sheet([]);
    }

    // 处理表头
    let headers: string[] = [];
    let dataKeys: string[] = [];

    if (header) {
      dataKeys = Object.keys(header);
      headers = dataKeys.map(key => header[key]);
    } else {
      dataKeys = Object.keys(data[0]);
      headers = [...dataKeys];
    }

    // 准备工作表数据
    const wsData = [headers];
    
    // 添加数据行
    data.forEach(item => {
      const rowData = dataKeys.map(key => {
        const value = item[key];
        
        if (value instanceof Date) {
          return value.toISOString().split('T')[0];
        } else if (Array.isArray(value)) {
          return value.join(', ');
        } else if (typeof value === 'object' && value !== null) {
          return JSON.stringify(value);
        }
        
        return value !== undefined && value !== null ? value : '';
      });
      
      wsData.push(rowData);
    });

    return XLSX.utils.aoa_to_sheet(wsData);
  }

  /**
   * 创建并下载Excel文件
   * @param sheets 工作表配置数组
   * @param fileName 文件名
   */
  static createExcelFile(
    sheets: Array<{
      name: string;
      data: any[];
      header?: Record<string, string>;
    }>,
    fileName: string = 'export.xlsx'
  ): void {
    const wb = XLSX.utils.book_new();
    
    sheets.forEach(sheet => {
      const ws = this.jsonToSheet(sheet.data, sheet.header);
      XLSX.utils.book_append_sheet(wb, ws, sheet.name);
    });
    
    XLSX.writeFile(wb, fileName);
  }
}

/**
 * 解析Excel文件为JSON数据的便捷函数
 */
export const parseExcel = ExcelUtils.parseExcelToJson;

/**
 * 导出JSON数据到Excel文件的便捷函数
 */
export const exportToExcel = ExcelUtils.exportJsonToExcel;

export default ExcelUtils;