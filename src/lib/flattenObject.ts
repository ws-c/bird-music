export default function flattenObject(obj) {
  const result = {};
  const stack = [{ obj }];
  
  while (stack.length > 0) {
    const { obj } = stack.pop();
    
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        
        if (value && typeof value === 'object' && !Array.isArray(value)) {
          stack.push({ obj: value });
        } else {
          result[key] = value;
        }
      }
    }
  }
  
  return result;
}