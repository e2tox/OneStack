import 'reflect-metadata'
import { IAttribute } from './attribute';
import { IsObject, IsUndefined, ToPropertyKey } from './utils';

// metadata key for ES7 Reflect.metadata
const REFLECTION_METADATA_KEY = Symbol.for('agent.framework.reflection');

/**
 * Reflection
 */
export class Reflection {
  
  private _attributes: Array<IAttribute>;
  
  constructor(private _target: Object, private _targetKey?: string | symbol, private _descriptor?: PropertyDescriptor) {
    this._attributes = [];
  }
  
  /**
   * Get Reflection object
   * @param target
   * @param targetKey
   * @param descriptor
   * @returns {Reflection}
   */
  public static getInstance(target: Object | Function,
                            targetKey?: string | symbol,
                            descriptor?: PropertyDescriptor): Reflection {
    if (!IsObject(target)) {
      throw new TypeError();
    }
    if (!IsUndefined(targetKey)) {
      targetKey = ToPropertyKey(targetKey);
    }
    let reflection = Reflect.getMetadata(REFLECTION_METADATA_KEY, target, targetKey) as Reflection;
    if (!reflection) {
      reflection = new Reflection(target, targetKey, descriptor);
      Reflect.metadata(REFLECTION_METADATA_KEY, reflection)(target, targetKey);
    }
    return reflection;
  }
  
  /**
   * Get Reflection object from itself or parent
   * @param target
   * @param targetKey
   * @param descriptor
   * @returns {Reflection}
   */
  public static getOwnInstance(target: Object | Function,
                               targetKey?: string | symbol,
                               descriptor?: PropertyDescriptor): Reflection {
    if (!IsObject(target)) {
      throw new TypeError();
    }
    if (!IsUndefined(targetKey)) {
      targetKey = ToPropertyKey(targetKey);
    }
    let reflection = Reflect.getOwnMetadata(REFLECTION_METADATA_KEY, target, targetKey) as Reflection;
    if (!reflection) {
      reflection = new Reflection(target, targetKey, descriptor);
      Reflect.metadata(REFLECTION_METADATA_KEY, reflection)(target, targetKey);
    }
    return reflection;
  }
  
  /**
   * Get attributes from itself or parent
   * @param target
   * @param targetKey
   * @returns {any}
   */
  public static getAttributes(target: Object | Function, targetKey?: any): Array<IAttribute> {
    const reflection = Reflection.getInstance(target, targetKey);
    return reflection ? reflection.getAttributes() : [];
  }
  
  /**
   * Add an attribute to the type
   * @param attribute
   * @param target
   * @param targetKey
   * @param descriptor
   */
  public static addAttribute(attribute: IAttribute,
                             target: Object | Function,
                             targetKey?: string | symbol,
                             descriptor?: PropertyDescriptor) {
    
    const reflection = Reflection.getOwnInstance(target, targetKey, descriptor);
    reflection.addAttribute(attribute);
  }
  
  /**
   * Get attributes
   * @param target
   * @param targetKey
   * @returns {any}
   */
  public static getOwnAttributes(target: Object | Function, targetKey?: any): Array<IAttribute> {
    const reflection = Reflection.getOwnInstance(target, targetKey);
    return reflection ? reflection.getAttributes() : [];
  }
  
  getAttributes(): Array<IAttribute> {
    return this._attributes;
  }
  
  addAttribute(attr: IAttribute): void {
    this._attributes.push(attr);
  }
  
  get target(): Object | Function {
    return this._target;
  }
  
  get targetKey(): string | symbol {
    return this._targetKey;
  }
  
  get descriptor(): PropertyDescriptor | null {
    return this._descriptor;
  }
  
}
