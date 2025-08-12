<template>
  <q-card
    style="overflow-y: scroll"
    flat
    bordered
    class="q-pa-lg bg-white text-black rounded-borders"
  >
    <div class="row justify-between items-center">
      <div class="text-h6">Company Profile</div>
      <div>
        <q-btn
          dense
          flat
          round
          icon="edit"
          v-if="!isEditable"
          @click="enableEdit"
          color="black"
        />
        <q-btn
          dense
          flat
          round
          icon="check"
          v-if="isEditable"
          @click="save"
          color="positive"
        />
        <q-btn
          dense
          flat
          round
          icon="close"
          v-if="isEditable"
          @click="cancelEdit"
          color="negative"
        />
      </div>
    </div>

    <q-separator class="q-my-md" color="grey-4" />

    <q-form class="column q-gutter-md">
      <q-input
        v-model="editData.name"
        :disable="!isEditable"
        filled
        label="Company Name"
      />
      <q-input
        v-model="editData.description"
        :disable="!isEditable"
        filled
        type="textarea"
        label="Description"
      />
      <q-select
        v-model="editData.companySize"
        :disable="!isEditable"
        filled
        label="Company Size"
        :options="sizeOptions"
      />
      <q-select
        v-model="editData.status"
        :disable="!isEditable"
        filled
        label="Status"
        :options="statusOptions"
      />
      <q-input
        v-model="editData.CEO"
        :disable="!isEditable"
        filled
        label="CEO"
      />
      <q-input
        v-model="editData.companyEmail"
        :disable="!isEditable"
        filled
        label="Company Email"
      />

      <q-input
        v-model="editData.location"
        :disable="!isEditable"
        filled
        label="Location"
      />

      <!-- Tags -->
      <div class="row items-center justify-between">
        <div class="text-subtitle1">Tags</div>
        <q-btn
          v-if="isEditable"
          flat
          dense
          round
          icon="add"
          color="primary"
          @click="addTag"
        />
      </div>
      <div
        v-for="(tag, index) in editData.tags"
        :key="'tag-' + index"
        class="q-my-sm row items-center"
      >
        <q-input
          v-model="editData.tags[index]"
          :disable="!isEditable"
          filled
          class="col"
        />
        <q-btn
          v-if="isEditable"
          flat
          dense
          round
          icon="remove"
          color="negative"
          @click="removeTag(index)"
          class="q-ml-sm"
        />
      </div>

      <!-- Links -->
      <div class="row items-center justify-between q-mt-md">
        <div class="text-subtitle1">Links</div>
        <q-btn
          v-if="isEditable"
          flat
          dense
          round
          icon="add"
          color="primary"
          @click="addLink"
        />
      </div>
      <div
        v-for="(link, index) in editData.links"
        :key="'link-' + index"
        class="q-my-sm row items-center"
      >
        <q-input
          v-model="editData.links[index]"
          :disable="!isEditable"
          filled
          class="col"
        />
        <q-btn
          v-if="isEditable"
          flat
          dense
          round
          icon="remove"
          color="negative"
          @click="removeLink(index)"
          class="q-ml-sm"
        />
      </div>
    </q-form>
  </q-card>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import { useQuasar } from "quasar";
import { useUserStore } from "src/stores/user-store";

const $q = useQuasar();
const isEditable = ref(false);

const editData = reactive(JSON.parse(JSON.stringify(useUserStore().company)));

const sizeOptions = ["1-10", "11-50", "51-200", "201-500", "500+"];
const statusOptions = ["Hiring", "Not-Hiring"];

onMounted(() => {
  console.log("Reactive Edit Data:", editData);
});

function enableEdit() {
  isEditable.value = true;
}

function addTag() {
  if (!Array.isArray(editData.tags)) {
    editData.tags = [];
  }
  editData.tags.push("");
}

function addLink() {
  if (!Array.isArray(editData.links)) {
    editData.links = [];
  }
  editData.links.push("");
}

function removeTag(index) {
  if (Array.isArray(editData.tags)) {
    editData.tags.splice(index, 1);
  }
}

function removeLink(index) {
  if (Array.isArray(editData.links)) {
    editData.links.splice(index, 1);
  }
}

function cancelEdit() {
  Object.assign(editData, JSON.parse(JSON.stringify(useUserStore().company)));
  isEditable.value = false;
}

async function save() {
  isEditable.value = false;
  try {
    const response = await useUserStore().updateRecruiter(editData);

    if (response.message == "success") {
      $q.notify({ type: "positive", message: "Company updated." });
    } else {
      $q.notify({ type: "negative", message: "Company updated failed." });
    }
  } catch (err) {
    $q.notify({ type: "negative", message: "Failed to save changes." });
  }
}
</script>

<style scoped>
.bg-white {
  background-color: #ffffff;
}

.text-black {
  color: #000000;
}

.rounded-borders {
  border-radius: 12px;
}
</style>
