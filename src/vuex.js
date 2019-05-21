
let Vue;

class ModuleCollection {
  constructor(options) {
    this.register([], options)
  }

  register(path, rawModule) {
    // path 是空数组  rawModule就是个对象
    let newModule = {
      name: path[path.length - 1] || 'root',
      _raw: rawModule,
      _children: {},
      state: rawModule.state
    }

    if (path.length === 0) {
      this.root = newModule
    } else { // ['a', 'b', 'c']
      // console.log('===', path, path.slice(0, -1))
      // 每次得到对象树中最后一个module
      let parent = path.slice(0, -1).reduce((root, current) => {
        return root['_children'][current]
      }, this.root)
      // console.log('before', JSON.stringify(parent))

      // ['a', 'b', 'c'] => root.children = a.children = b.children = c.children
      // 将下一个module 挂载到 当前最后一个module的_children属性中
      parent._children[path[path.length - 1]] = newModule
      // console.log('after', JSON.stringify(parent))
    }


    if (rawModule.modules) {
      forEach(rawModule.modules, (moduleName, module) => {
        this.register(path.concat(moduleName), module)
      })
    }
    // console.log(this.root)
  }
}

function forEach(obj, callback) {
  Object.keys(obj).forEach(item => callback(item, obj[item]))
}

function installModule(store, rootState, path, rootModule) {

  // state分级处理
  if (path.length > 0) {
    console.log(rootState, path.slice(0, -1), rootModule.name)
    let parent = path.slice(0, -1).reduce((root, current) => {
      return root[current]
    }, rootState)

    Vue.set(parent, path[path.length - 1], rootModule.state)
  }

  if (rootModule._raw.getters) {
    forEach(rootModule._raw.getters, (getterName, getterFn) => {
      Object.defineProperty(store.getters, getterName, {
        get() {
          return getterFn(rootModule.state)
        }
      })
    })
  }

  if (rootModule._raw.actions) {
    forEach(rootModule._raw.actions, (actionName, actionFn) => {
      let entry = store.actions[actionName] || (store.actions[actionName] = [])
      entry.push(() => {
        actionFn.call(store, store)
      })
    })
  }

  if (rootModule._raw.mutations) {
    forEach(rootModule._raw.mutations, (mutationName, mutationFn) => {
      let entry = store.mutations[mutationName] || (store.mutations[mutationName] = [])
      entry.push(() => {
        mutationFn.call(store, rootModule.state)
      })
    })
  }

  forEach(rootModule._children, (childName, module) => {
    installModule(store, rootState, path.concat(childName), module)
  })

}

class Store {
  constructor(options) {
    // state
    let state = options.state

    this.getters = {}
    this.mutations = {}
    this.actions = {}

    // 把模块之间关系进行分级处理  ['a', 'b'] => root.children = a.children = b
    this.modules = new ModuleCollection(options)

    // 将state转变为响应式
    this._vm = new Vue({
      data: {
        state
      }
    })

    /**
     * this 当前Store实例
     * state 根状态
     * [] path
     * modules.root 根模块
     */
    installModule(this, state, [], this.modules.root)

    // // getters
    // let getters = options.getters
    // forEach(getters, (getterName, getterFn) => {
    //   Object.defineProperty(this.getters, getterName, {
    //     get: () => {
    //       return getterFn(state)
    //     }
    //   })
    // })

    // // mutations
    // let mutations = options.mutations
    // forEach(mutations, (mutationName, mutationFn) => {
    //   this.mutations[mutationName] = mutationFn.bind(this, state)
    // })

    // // actions
    // let actions = options.actions
    // forEach(actions, (actionName, actionFn) => {
    //   this.actions[actionName] = actionFn.bind(this, this)
    // })

    let { commit, dispatch } = this
    this.commit = type => {
      commit.call(this, type)
    }

    this.dispatch = type => {
      return dispatch.call(this, type)
    }
  }

  get state() {
    return this._vm.state
  }

  commit(type) {
    this.mutations[type].forEach(fn => fn())
  }

  dispatch(type) {
    return this.actions[type].forEach(fn => fn())
  }
}

const install = (_Vue) => {
  // console.log(_Vue, 'install')
  Vue = _Vue

  // 给每个组件实例混入beforeCreate钩子函数
  Vue.mixin({
    // 给根组件 以及 所有的组件实例添加$store属性
    beforeCreate() {
      if (this.$options && this.$options.store) {
        this.$store = this.$options.store
      } else { // beforeCreate执行顺序 根 => 父 => 子
        this.$store = this.$parent && this.$parent.$store
      }
      // console.log(this.$options.name, this.$store)
    }
  })
}

export default {
  Store,
  install
}