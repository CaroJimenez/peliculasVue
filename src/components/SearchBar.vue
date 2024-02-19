<template>
  <div class="search-bar">
    <div class="input-group">
      <div class="mainContainer">
        <div class="optionsContainer">
          <b-form-select
            v-model="selected"
            :options="options"
            required
          ></b-form-select>
        </div>
        <div class="inputContainer">
          <input
            v-if="selected === 'Nombre'"
            type="text"
            class="form-control"
            v-model="searchQuery"
            placeholder="Buscar por nombre..."
            @input="updateSearchQuery"
          />
          <input
            v-else-if="selected === 'Director'"
            type="text"
            class="form-control"
            v-model="searchQuery"
            placeholder="Buscar por director..."
            @input="updateSearchQuery"
          />
          <input
            v-else-if="selected === 'Género o categoría'"
            type="text"
            class="form-control"
            v-model="searchQuery"
            placeholder="Buscar por género/categoría..."
            @input="updateSearchQuery"
          />
        </div>
      </div>

      <div class="input-group-append" v-if="selected">
        <button class="btn btn-secondary" type="button" @click="search">
          Buscar
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { getMoviesByOption } from "../network/index";
export default {
  data() {
    return {
      searchQuery: "",
      selected: null,
      options: [
        { text: "Buscar por:", value: null, disabled: true },
        "Fecha de publicación",
        "Nombre",
        "Director",
        "Género o categoría",
      ],
      movies: [],
    };
  },
  methods: {
    async search() {
      try {
        this.movies = await getMoviesByOption(this.selected, this.searchQuery);
        this.$emit("search", this.movies);
      } catch (error) {
        console.error(error);
      }
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

.mainContainer {
  display: flex;
  align-items: center;
}

.optionsContainer {
  padding-right: 10px;
}
</style>
