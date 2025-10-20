/**
 * CSV解析工具类，提供CSV字符串解析和JSON数据转换为CSV功能
 */
export class CSVParser {
  /**
   * 将CSV字符串解析为JSON数组
   * @param csv CSV字符串
   * @param options 解析选项
   * @returns 解析后的JSON数组
   */
  static parse(
    csv: string, 
    options: {
      delimiter?: string;
      header?: boolean;
      quote?: string;
      escape?: string;
      skipEmptyLines?: boolean;
    } = {}
  ): any[] {
    // 默认选项
    const opts = {
      delimiter: options.delimiter || ',',
      header: options.header !== undefined ? options.header : true,
      quote: options.quote || '"',
      escape: options.escape || options.quote || '"',
      skipEmptyLines: options.skipEmptyLines !== undefined ? options.skipEmptyLines : true,
    };

    // 分割CSV行
    const lines = this.splitCSVLines(csv, opts);
    
    if (lines.length === 0) {
      return [];
    }

    // 获取表头
    let headers: string[] = [];
    let dataLines = lines;
    
    if (opts.header) {
      headers = this.parseCSVLine(lines[0], opts);
      dataLines = lines.slice(1);
    } else {
      // 如果没有表头，使用索引作为键
      const maxColumns = Math.max(...dataLines.map(line => this.parseCSVLine(line, opts).length));
      headers = Array.from({ length: maxColumns }, (_, i) => `column${i}`);
    }

    // 解析数据行
    const result: any[] = [];
    
    for (const line of dataLines) {
      if (opts.skipEmptyLines && this.isLineEmpty(line)) {
        continue;
      }
      
      const values = this.parseCSVLine(line, opts);
      const row: any = {};
      
      for (let i = 0; i < headers.length; i++) {
        row[headers[i]] = i < values.length ? values[i] : '';
      }
      
      result.push(row);
    }

    return result;
  }

  /**
   * 将JSON数组转换为CSV字符串
   * @param data 要转换的JSON数据
   * @param options 转换选项
   * @returns CSV字符串
   */
  static stringify(
    data: any[],
    options: {
      delimiter?: string;
      header?: boolean;
      quote?: string;
      escape?: string;
      headers?: string[];
      newline?: string;
    } = {}
  ): string {
    if (!data || data.length === 0) {
      return '';
    }

    // 默认选项
    const opts = {
      delimiter: options.delimiter || ',',
      header: options.header !== undefined ? options.header : true,
      quote: options.quote || '"',
      escape: options.escape || options.quote || '"',
      headers: options.headers,
      newline: options.newline || '\n',
    };

    // 获取表头
    let headers: string[] = [];
    
    if (opts.headers) {
      headers = opts.headers;
    } else if (opts.header) {
      // 从数据中提取表头
      headers = Array.from(new Set(data.flatMap(item => Object.keys(item))));
    }

    // 构建CSV行
    const lines: string[] = [];
    
    // 添加表头行
    if (opts.header && headers.length > 0) {
      lines.push(this.stringifyCSVLine(headers, opts));
    }

    // 添加数据行
    for (const item of data) {
      const values = headers.map(header => item[header] !== undefined ? item[header] : '');
      lines.push(this.stringifyCSVLine(values, opts));
    }

    return lines.join(opts.newline);
  }

  /**
   * 解析CSV行
   */
  private static parseCSVLine(line: string, options: { delimiter: string; quote: string; escape: string }): string[] {
    const result: string[] = [];
    let currentValue = '';
    let inQuotes = false;
    let escaped = false;
    let i = 0;
    const { delimiter, quote, escape } = options;

    while (i < line.length) {
      const char = line[i];
      
      if (escaped) {
        // 转义字符后的字符直接添加
        currentValue += char;
        escaped = false;
        i++;
        continue;
      }

      if (char === escape) {
        // 检查下一个字符是否也是转义字符
        if (i + 1 < line.length && line[i + 1] === quote) {
          // 双引号表示一个引号
          currentValue += quote;
          i += 2;
        } else {
          // 转义字符
          escaped = true;
          i++;
        }
        continue;
      }

      if (char === quote) {
        inQuotes = !inQuotes;
        i++;
        continue;
      }

      if (!inQuotes && char === delimiter) {
        // 分隔符，结束当前值
        result.push(currentValue);
        currentValue = '';
        i++;
        continue;
      }

      // 普通字符
      currentValue += char;
      i++;
    }

    // 添加最后一个值
    result.push(currentValue);

    // 如果行以分隔符结束，添加一个空值
    if (line[line.length - 1] === delimiter) {
      result.push('');
    }

    return result;
  }

  /**
   * 将值数组转换为CSV行
   */
  private static stringifyCSVLine(values: any[], options: { delimiter: string; quote: string; escape: string }): string {
    const { delimiter, quote, escape } = options;
    
    return values.map(value => {
      // 转换为字符串
      let strValue = value === null || value === undefined ? '' : String(value);
      
      // 如果值包含分隔符、引号或换行符，需要用引号括起来
      if (strValue.includes(delimiter) || strValue.includes(quote) || strValue.includes('\n') || strValue.includes('\r')) {
        // 转义引号
        strValue = strValue.replace(new RegExp(quote, 'g'), escape + quote);
        return quote + strValue + quote;
      }
      
      return strValue;
    }).join(delimiter);
  }

  /**
   * 分割CSV行，处理引号内的换行
   */
  private static splitCSVLines(csv: string, options: { quote: string }): string[] {
    const lines: string[] = [];
    let currentLine = '';
    let inQuotes = false;
    const { quote } = options;
    
    // 处理不同的换行符
    const normalizedCSV = csv.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    
    for (const char of normalizedCSV) {
      if (char === quote) {
        inQuotes = !inQuotes;
        currentLine += char;
      } else if (char === '\n' && !inQuotes) {
        // 行结束
        lines.push(currentLine);
        currentLine = '';
      } else {
        currentLine += char;
      }
    }
    
    // 添加最后一行
    if (currentLine) {
      lines.push(currentLine);
    }
    
    return lines;
  }

  /**
   * 检查行是否为空
   */
  private static isLineEmpty(line: string): boolean {
    return line.trim() === '';
  }

  /**
   * 从文件中读取CSV并解析为JSON
   * @param file 文件对象
   * @param options 解析选项
   * @returns 解析后的JSON数组
   */
  static async fromFile(
    file: File,
    options?: {
      delimiter?: string;
      header?: boolean;
      quote?: string;
      escape?: string;
      skipEmptyLines?: boolean;
    }
  ): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const csv = e.target?.result as string;
          const result = this.parse(csv, options);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(reader.error);
      reader.readAsText(file);
    });
  }

  /**
   * 将JSON数据转换为CSV并下载为文件
   * @param data JSON数据
   * @param fileName 文件名
   * @param options 转换选项
   */
  static toFile(
    data: any[],
    fileName: string = 'data.csv',
    options?: {
      delimiter?: string;
      header?: boolean;
      quote?: string;
      escape?: string;
      headers?: string[];
    }
  ): void {
    const csv = this.stringify(data, options);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

/**
 * 解析CSV字符串为JSON的便捷函数
 */
export const parseCSV = CSVParser.parse;

/**
 * 将JSON数据转换为CSV字符串的便捷函数
 */
export const stringifyCSV = CSVParser.stringify;

/**
 * 从文件读取CSV的便捷函数
 */
export const readCSVFile = CSVParser.fromFile;

/**
 * 将JSON数据导出为CSV文件的便捷函数
 */
export const exportToCSV = CSVParser.toFile;

export default CSVParser;