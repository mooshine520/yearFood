<template>
<div>
	首页
	<router-link :to="'/join'">参与</router-link>
	<router-link :to="'/photolist'">投票</router-link>
	<router-link :to="'/winners'">获奖查询</router-link>
</div>
</template>
<script>
export default{
	name:'index'
}
</script>
<style>
</style>