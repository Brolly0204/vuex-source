import Vue from 'vue'
import Vuex from './vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    a: {
      state: {
        count: 200
      },
      mutations: {
        change(state) {
          console.log('moduleA change')
          state.count++
        }
      },
      modules: {
        b: {
          state: {
            count: 300
          },
          modules: {
            c: {
              state: {
                count: 300
              }
            }
          }
        }
      }
    },
    n: {
      state: {
        price: 20000
      }
    }
  },
  state: {
    count: 1
  },
  getters: {
    count(state) {
      return state.count * 2
    }
  },
  mutations: {
    change(state) {
      console.log('root change')
      state.count += 2
    }
  }
})

// new Vuex.Store({
//   modules: {
//     number: {
//       state: {
//         // $store.state.number.num
//         num: 1
//       },
//       getters: {
//         // $store.getters.num
//         num(state) {
//           return state.num * 3
//         }
//       },
//       mutations: {
//         // $store.commit('ADD_NUM')
//         ADD_NUM(state) {
//           console.log('modules ADD_NUM')
//           state.num++
//         }
//       },
//       actions: {
//         // $store.dispatch('addNum')
//         addNum({ commit }) {
//           setTimeout(() => {
//             commit('ADD_NUM')
//           }, 1000)
//         }
//       }
//     },
//     account: {
//       namespaced: true,
//       state: {
//         // $store.state.account.price
//         price: 10
//       },
//       getters: {
//         // $store.getters['account/price']
//         price(state) {
//           return state.price * 2
//         }
//       },
//       mutations: {
//         // $store.commit('account/ADD_PRICE')
//         ADD_PRICE(state) {
//           state.price += 10
//         }
//       },
//       actions: {
//         // $store.dispatch('account/addPrice')
//         addPrice({ commit, dispatch, state, getters, rootState, rootGetters }) {
//           // { commit, dispatch, getters, rootGetters, state, rootState }
//           console.log('actions', arguments[0])
//           setTimeout(() => {
//             commit('ADD_PRICE')
//           }, 1000)
//         }
//       }
//     }
//   },
//   state: {
//     count: 1
//   },
//   getters: {
//     count(state) {
//       return state.count * 2
//     }
//   },
//   mutations: {
//     INCREASE(state) {
//       state.count++
//     },
//     ADD_NUM(state) { // 当顶级mutations 和 modules中mutations 重名时，会被放在数组里储存起来，当commit时 分别执行数组中每一个mutation函数
//       console.log(arguments)
//       console.log('root ADD_NUM')
//       state.count += 2
//     }
//   },
//   actions: {
//     increase({ commit }) {
//       return new Promise((resolve, reject) => {
//         setTimeout(() => {
//           commit('INCREASE')
//           resolve('actioned')
//         }, 1000)
//       })
//     }
//   }
// })
