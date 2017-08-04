<template>
  <ul class="toggle">
    <li class="toggle-item" v-for="(item,index) in toggle" :class="{'active':currentIndex===index}" @click="toggleItem(index)">
      <span>{{item.name}}</span>
    </li>
  </ul>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
   		toggle:{
   			type:Array,
   			default:[]
   		},
   		currentIndex:{
   			type:Number,
   			default:0
   		}
    },   
    methods: {
	   	toggleItem(index){
	  		this.$emit('toggle', index);
	  	}
    }
  };
</script>

<style lang="scss" scoped>
  @import "../../common/style/variable";
  
  .toggle{
    display: flex;
    width:100%;
    .toggle-item{
    	flex: 1;
      text-align: center;
      height:30px;
      line-height:30px;
      font-weight:bold;
      color:#666;
      &.active{
      	color:#fff;
      	border-bottom: 1px solid #fff;
      }
    }
  }
    
    
      
</style>
