interface IData {
  [key: string]: any;
}

class Vue {
  $data: IData;
  data: IData;
  constructor(options) {
    this.$data = options.data();
    this.data = options.data();
    this.init(this.data);
  }
  init(obj: IData) {
    this.defineProperty(obj, this.$data)
  }
  decorateArr(arr) {
    const arrayMethods = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'];
    arrayMethods.forEach(method => {
      const arrProto = Array.prototype;
      const origin = Object.create(arrProto);
      Object.defineProperty(arr, method, {
        value: function (...args) {
          origin[method].apply(this, args);
          arr.__proto__ = origin;
          return arr;
        }
      })
    })
  }
  defineProperty(obj1: IData, obj2: IData) {
    for (let item in obj1) {
      let value = obj1[item] as IData;
      if (typeof value === 'object' && !(value instanceof Array)) {
        this.defineProperty(value, <IData>obj2[item])
      } else if (value instanceof Array) {
        this.decorateArr(value)
      } else {
        Object.defineProperty(obj1, item, {
          get() {
            return obj2[item]
          },
          set(newValue) {
            obj2[item] = newValue;
          }
        })
      }

    }
  }

}
const app = new Vue({
  data: () => ({
    x: '111',
    user: {
      name: 'Alice',
      age: 25
    },
    arr: [1, 2, 3]
  })
});



console.log(app);
