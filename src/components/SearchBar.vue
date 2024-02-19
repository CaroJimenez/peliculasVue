<template>
  <div class="search-bar">
    <div class="input-group">
      <div class="inputContainer">
        <input
          type="text"
          class="form-control"
          v-model="searchQuery"
          placeholder="Buscar película..."
          @input="updateSearchQuery"
        />
      </div>

      <div class="input-group-append">
        <button class="btn btn-secondary" type="button" @click="search">
          Buscar
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchQuery: "",
    };
  },
  methods: {
    search() {
      this.$emit("search", this.searchQuery);
    },
    updateSearchQuery() {
      this.$emit("input", this.searchQuery);
    },
  },
};
</script>

<style scoped>
.inputContainer {
  margin-right: 10px;
}
</style>
