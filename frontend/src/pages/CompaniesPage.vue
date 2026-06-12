<script setup lang="ts">
import { reactive, ref } from 'vue';
import { AddCircleOutline } from '@vicons/ionicons5';
import CompanyCard from '@/components/common/CompanyCard.vue';
import PositionList from '@/components/common/PositionList.vue';
import { useCompanyStore } from '@/stores/company';
import { usePositionStore } from '@/stores/position';
import type { Company, CompanyDraft } from '@/types/company';

const companyStore = useCompanyStore();
const positionStore = usePositionStore();
const isDrawerOpen = ref(false);
const editingId = ref<string | null>(null);

const form = reactive<CompanyDraft>({
  name: '',
  industry: '',
  size: '',
  logoUrl: '',
  notes: ''
});

function resetForm(): void {
  Object.assign(form, {
    name: '',
    industry: '',
    size: '',
    logoUrl: '',
    notes: ''
  });
}

function openCreate(): void {
  editingId.value = null;
  resetForm();
  isDrawerOpen.value = true;
}

function openEdit(company: Company): void {
  editingId.value = company.id;
  Object.assign(form, {
    name: company.name,
    industry: company.industry,
    size: company.size,
    logoUrl: company.logoUrl,
    notes: company.notes
  });
  isDrawerOpen.value = true;
}

function saveCompany(): void {
  if (!form.name) {
    return;
  }

  if (editingId.value) {
    companyStore.updateCompany(editingId.value, { ...form });
  } else {
    companyStore.addCompany({ ...form });
  }

  isDrawerOpen.value = false;
}

function deleteCompany(company: Company): void {
  const relatedCount = positionStore.byCompany(company.id).length;
  const message = relatedCount ? `该公司下有 ${relatedCount} 个职位，删除后职位会显示为未关联公司。继续删除？` : `删除 ${company.name}？`;
  if (window.confirm(message)) {
    companyStore.removeCompany(company.id);
  }
}
</script>

<template>
  <section class="page companies-page">
    <header class="page-header">
      <div>
        <p class="page-kicker">COMPANIES</p>
        <h1 class="page-title">公司池与职位关系</h1>
        <p class="page-subtitle">维护公司画像，展开即可查看每家公司下所有投递职位。</p>
      </div>
      <n-button type="primary" @click="openCreate">
        <template #icon>
          <n-icon :component="AddCircleOutline" />
        </template>
        新建公司
      </n-button>
    </header>

    <div class="company-grid">
      <CompanyCard
        v-for="company in companyStore.sortedCompanies"
        :key="company.id"
        :company="company"
        :positions="positionStore.byCompany(company.id)"
        @edit="openEdit"
        @delete="deleteCompany"
      >
        <n-collapse>
          <n-collapse-item title="查看职位" :name="company.id">
            <PositionList :positions="positionStore.byCompany(company.id)" />
          </n-collapse-item>
        </n-collapse>
      </CompanyCard>
    </div>

    <n-drawer v-model:show="isDrawerOpen" width="440">
      <n-drawer-content :title="editingId ? '编辑公司' : '新建公司'" closable>
        <n-form label-placement="top">
          <n-form-item label="公司名称">
            <n-input v-model:value="form.name" />
          </n-form-item>
          <n-grid :cols="2" :x-gap="12" responsive="screen">
            <n-form-item-gi label="行业">
              <n-input v-model:value="form.industry" />
            </n-form-item-gi>
            <n-form-item-gi label="规模">
              <n-input v-model:value="form.size" />
            </n-form-item-gi>
          </n-grid>
          <n-form-item label="Logo URL">
            <n-input v-model:value="form.logoUrl" placeholder="https://..." />
          </n-form-item>
          <n-form-item label="备注">
            <n-input v-model:value="form.notes" type="textarea" :autosize="{ minRows: 4, maxRows: 8 }" />
          </n-form-item>
        </n-form>
        <template #footer>
          <n-space justify="end">
            <n-button @click="isDrawerOpen = false">取消</n-button>
            <n-button type="primary" :disabled="!form.name" @click="saveCompany">保存</n-button>
          </n-space>
        </template>
      </n-drawer-content>
    </n-drawer>
  </section>
</template>

<style scoped>
.company-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 16px;
}
</style>
