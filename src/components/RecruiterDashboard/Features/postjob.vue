<template>
  <div class="form-wrapper">
    <q-card class="post-job-card">
      <div class="text-h6">
        {{ isPreviewing ? "Preview Job Post" : "Post a Job" }}
      </div>

      <q-form
        v-if="!isPreviewing"
        ref="formRef"
        @submit.prevent="handlePreview"
      >
        <div class="section-title">Basic Details</div>
        <div class="form-entry">
          <q-input
            v-model="form.title"
            label="Job Title"
            filled
            :rules="[isRequired, maxLength(100)]"
          />
          <q-input
            v-model="form.company"
            label="Company Name"
            filled
            readonly
          />
          <q-select
            v-model="form.job_type"
            :options="jobTypes"
            label="Job Type"
            filled
            :rules="[isRequired]"
          />
        </div>

        <div class="section-title">Job Logistics</div>
        <div class="form-entry">
          <q-select
            v-model="form.mode_of_work"
            :options="modeOptions"
            label="Mode of Work"
            filled
            :rules="[isRequired]"
          />
          <q-input
            v-model.number="form.exp_required"
            label="Experience Required (Years)"
            type="number"
            filled
            :rules="[isRequired, isPositiveNumber]"
            min="0"
            max="50"
          />

          <q-input
            v-model="form.salary"
            label="Salary"
            filled
            :rules="[isRequired, isSalaryValid]"
            class="q-mb-md"
          />

          <!-- ✅ Equity (Optional) -->
          <q-input
            v-model.number="form.equity"
            label="Equity % (Optional)"
            type="number"
            filled
            min="0"
            max="100"
            step="0.1"
          />
        </div>

        <div class="section-title">Location & Skills</div>
        <div class="form-entry">
          <q-select
            v-model="form.lid"
            :options="[1]"
            label="Branch Location"
            filled
            :rules="[]"
            emit-value
            map-options
          />
          <q-select
            v-model="form.skillids"
            :options="skillOptions"
            label="Required Skills"
            filled
            use-chips
            multiple
            :rules="[isRequired]"
            emit-value
            map-options
          />
        </div>

        <div class="section-title">Description</div>
        <div class="form-entry">
          <q-input
            v-model="form.smallDescription"
            label="Short Description"
            type="textarea"
            filled
            :rules="[minLength(10), maxLength(100), isRequired]"
            placeholder="e.g. A brief summary of the job role"
          />
        </div>

        <div class="form-entry q-mt-md">
          <q-input
            v-model="form.bigDescription"
            label="Detailed Job Description"
            type="textarea"
            filled
            :rules="[minLength(20), isRequired]"
            placeholder="e.g. Full responsibilities, requirements, etc."
            rows="6"
          />
        </div>

        <q-card-actions align="right">
          <q-btn type="submit" label="Preview Job" color="primary" />
        </q-card-actions>
      </q-form>

      <div v-else class="form-wrapper">
        <q-separator />
        <q-card-section>
          <JobCardPreview :job="previewJob" />
        </q-card-section>
        <q-card-actions align="between" class="q-pa-md">
          <q-btn
            flat
            label="Back to Edit"
            color="grey-6"
            @click="isPreviewing = false"
          />
          <q-btn
            label="Submit Job"
            color="primary"
            @click="submitJob"
            :loading="isSubmitting"
          />
        </q-card-actions>
      </div>
    </q-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useQuasar } from "quasar";
import { useJobsStore } from "src/stores/jobStore";
import { useUserStore } from "src/stores/user-store";
import JobCardPreview from "src/components/Jobs/ListJobs/JobCard.vue";

const $q = useQuasar();

const formRef = ref(null);
const isPreviewing = ref(false);
const isSubmitting = ref(false);

const skillOptions = computed(() => {
  return [
    { label: "CSS", value: 11 },
    { label: "Python", value: 6 },
    { label: "React", value: 3 },
  ];
});

const form = ref({
  title: "",
  company: "",
  job_type: "",
  mode_of_work: "",
  exp_required: 0,
  salary: 0,
  equity: 0,
  lid: null,
  cid: null,
  skillids: [],
  bigDescription: "",
  smallDescription: "",
});

const previewJob = computed(() => ({
  title: form.value.title,
  job_type: form.value.job_type,
  location: "Banglore",
  salary: form.value.salary,
  posted: new Date().toISOString().split("T")[0],

  company: {
    name: form.value.company,
    status: "Hiring",
    type: "No type",
    tags: [],
  },
}));

const jobTypes = ["Full-time", "Co-founder", "Contract", "internship"];
const modeOptions = ["Online", "Offline", "Hybrid"];

const isRequired = (val) => !!val || "This field is required";
const minLength = (n) => (val) =>
  !val || val.length >= n || `Minimum ${n} characters`;
const maxLength = (n) => (val) =>
  !val || val.length <= n || `Maximum ${n} characters`;

const isPositiveNumber = (val) => {
  return (val >= 0 && val <= 50) || "Experience should be between 0-50 years";
};

const isSalaryValid = (val) => {
  if (!val) return "Salary is required";
  const salary = val.toUpperCase().replace(/[₹\s]/g, "").trim();
  const lMatch = salary.match(/^([1-9]\d{0,3})L$/);
  const kMatch = salary.match(/^([1-9]\d{0,5})K$/);
  const raw = parseInt(salary);
  if (lMatch || kMatch) return true;
  return (
    (!isNaN(raw) && raw > 1000 && raw < 99990000) ||
    "Enter a valid salary like ₹5L or ₹800000"
  );
};

onMounted(() => {
  if (useUserStore().company) {
    form.value.company = useUserStore().company.companyName;
    form.value.cid = useUserStore().company.cid;
  }
});

async function handlePreview() {
  const success = await formRef.value.validate();
  if (!success) {
    $q.notify({
      type: "negative",
      message: "Please fix the form errors before previewing.",
    });
    return;
  }

  isPreviewing.value = true;
}

async function submitJob() {
  console.log("🔥 SUBMIT JOB FUNCTION CALLED!");

  isSubmitting.value = true;

  try {
    const jobData = {
      uid: useUserStore().uid,
      title: form.value.title,
      bigDescription: form.value.bigDescription,
      smallDescription: form.value.smallDescription,
      job_type: form.value.job_type,
      mode_of_work: form.value.mode_of_work,
      exp_required: form.value.exp_required,
      salary: form.value.salary,
      skillids: form.value.skillids,
      equity: form.value.equity || 0,
      lid: form.value.lid,
      cid: form.value.cid,
      posted: new Date().toISOString().split("T")[0],
    };

    const result = await useJobsStore().postJob(jobData);

    console.log("Job submission result:", result);
    console.log("Job data being submitted:", jobData);

    if (result.success) {
      $q.notify({
        type: "positive",
        message: "Job posted successfully!",
      });

      resetForm();
      isPreviewing.value = false;
    } else {
      $q.notify({
        type: "negative",
        message: result.message,
      });
    }
  } catch (error) {
    $q.notify({
      type: "negative",
      message: "An error occurred while posting the job",
    });
  } finally {
    isSubmitting.value = false;
  }
}

function resetForm() {
  form.value = {
    title: "",
    company: useUserStore().company.companyName || "",
    job_type: "",
    mode_of_work: "",
    exp_required: 0,
    salary: 0,
    equity: 0,
    lid: null,
    cid: useUserStore().company.cid,
    skillids: [],
    bigDescription: "",
    smallDescription: "",
  };

  formRef.value?.resetValidation();
}
</script>

<style scoped>
.post-job-card {
  width: 100%;
  padding: 24px;
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 4px 8px rgba(255, 255, 255, 0.4), 0 8px 16px rgba(0, 0, 0, 0.05),
    inset 0 1px 3px rgba(255, 255, 255, 0.6);
  display: flex;
  flex-direction: column;
  gap: 24px;
  box-sizing: border-box;
}

.form-header {
  font-weight: bold;
  font-size: 20px;
  color: #333;
  margin-bottom: -12px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #444;
}

.form-entry {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-wrapper {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  box-sizing: border-box;
  min-height: 0;
}

.link-row {
  display: flex;
  gap: 8px;
  align-items: flex-start;
}

.link-label {
  flex: 0 0 30%;
}

.link-url {
  flex: 1;
}

.link-remove {
  flex: 0 0 auto;
  margin-top: 8px;
}
</style>
