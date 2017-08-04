<template>
  <div class="search-history">
    <ul>
      <li :key="item" @click="selectItem(item)" class="history-item" v-for="item in searches">
        <span class="text">{{item}}</span>
        <span class="icon" @click.stop="deleteOne(item)">
          <i class="icon-close"></i>
        </span>
      </li>
    </ul>
    <div class="no-history" v-show="!searches.length">暂无搜索历史</div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      searches: {
        type: Array,
        default: []
      }
    },
    methods: {
      selectItem(item) {
        this.$emit('select', item);
      },
      deleteOne(item) {
        this.$emit('delete', item);
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "../../common/style/variable.scss";
  @import "../../common/style/mixin.scss";
  
  .search-history {
  	.history-item {
  		display: flex;
  		align-items: center;
  		height: 40px;
  		overflow: hidden;
  		.text {
  			flex: 1;
  			font-size: $font-size-medium;
  			color: $color-text;
  		}
  		.icon {
  			@include extend-click();
  			.icon-delete {
  				font-size: $font-size-small;
  				color: $color-text-f;
  			}
  		}
  	}
  	.no-history {
  		height: 40px;
  		line-height: 40px;
  		text-align: center;
  		font-size: $font-size-medium;
  	}
  }
        
</style>
