<template>
  <div id="app">
    <h3 @click="$store.commit('change')">{{$store.state.count}}</h3>
    <h3>{{$store.getters.count}}</h3>
    <h3>{{$store.state.a.count}}</h3>
    <h3>{{$store.state.a.b.count}}</h3>

    <!-- <h2>普通modules</h2> -->
    <!-- modules -->
    <!-- <h3>state: {{$store.state.number.num}}</h3>
    <h3>getters: {{$store.getters.num}}</h3>
    <h3 @click="$store.commit('ADD_NUM')">mutations: {{$store.state.number.num}}</h3>
    <h3 @click="$store.dispatch('addNum')">actions: {{$store.state.number.num}}</h3> -->


    <!-- <h2>modules_namespaced</h2> -->
    <!-- modules_namespaced -->
    <!-- <h3>state: {{$store.state.account.price}}</h3>
    <h3>getters: {{$store.getters['account/price']}}</h3>
    <h3 @click="$store.commit('account/ADD_PRICE')">mutations: {{$store.state.account.price}}</h3>
    <h3 @click="$store.dispatch('account/addPrice')">actions: {{$store.state.account.price}}</h3> -->

    <!-- <h2>顶级的mutations函数和modules中mutations函数重名 测试</h2> -->
    <!-- <h3 @click="$store.commit('ADD_NUM')">{{$store.state.count}}</h3> -->

    <!-- <h3>{{$store.state.count}}</h3>
    <h3>{{$store.getters.count}}</h3>
    <h3 @click="$store.commit('INCREASE')">{{$store.getters.count}}</h3>
    <h3 @click="dispatchAction">{{$store.state.count}}</h3> -->
  </div>
</template>

<script>

import HelloWrold from './components/HelloWorld'

export default {
  name: 'app',
  mounted() {
    console.log(this.$store)
  },
  methods: {
    dispatchAction() {
      this.$store.dispatch('increase').then(res => {
        console.log(res)
      })
    }
  },
  components: {
    HelloWrold
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
