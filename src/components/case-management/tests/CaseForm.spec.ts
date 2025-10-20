import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import CaseForm from '../CaseForm.vue';
import { usePatientStore } from '@/stores/patientStore';

// Mock Element Plus组件
vi.mock('element-plus', async () => {
  const actual = await vi.importActual('element-plus');
  return {
    ...actual,
    ElForm: {
      template: '<form><slot /></form>',
      props: ['model', 'rules', 'label-width']
    },
    ElFormItem: {
      template: '<div><slot /></div>',
      props: ['label', 'prop']
    },
    ElInput: {
      template: '<input v-model="modelValue" />',
      props: ['modelValue'],
      emits: ['update:modelValue']
    },
    ElDatePicker: {
      template: '<input v-model="modelValue" type="date" />',
      props: ['modelValue', 'type', 'placeholder', 'format', 'value-format'],
      emits: ['update:modelValue']
    },
    ElSelect: {
      template: '<select v-model="modelValue"><slot /></select>',
      props: ['modelValue', 'placeholder'],
      emits: ['update:modelValue']
    },
    ElOption: {
      template: '<option :value="value"><slot /></option>',
      props: ['label', 'value']
    }
  };
});

describe('CaseForm.vue', () => {
  let patientStore: any;
  
  beforeEach(() => {
    // Mock patient store
    patientStore = {
      getPatientInfo: vi.fn()
    };
    
    // 创建测试Pinia
    createTestingPinia({
      initialState: {
        patient: {
          patients: []
        }
      },
      stubActions: false,
      mocks: {
        patientStore
      }
    });
  });
  
  it('renders form correctly', () => {
    const wrapper = mount(CaseForm, {
      props: {
        patientId: '',
        admissionDate: ''
      },
      global: {
        plugins: [createTestingPinia()],
        stubs: {
          //  stub其他组件
        }
      }
    });
    
    // 检查表单元素
    expect(wrapper.find('input[placeholder="输入患者ID"]').exists()).toBe(true);
    expect(wrapper.find('input[placeholder="自动填充"]').exists()).toBe(true);
    expect(wrapper.find('input[type="date"]').exists()).toBe(true);
    expect(wrapper.find('select').exists()).toBe(true);
    expect(wrapper.find('textarea').exists()).toBe(true);
  });
  
  it('updates patient info when patientId changes', async () => {
    // Mock patient store return value
    patientStore.getPatientInfo.mockResolvedValue({
      id: 'P123',
      name: 'John Doe',
      gender: 'male',
      age: 30
    });
    
    const wrapper = mount(CaseForm, {
      props: {
        patientId: '',
        admissionDate: ''
      },
      global: {
        plugins: [createTestingPinia()],
        provide: {
          patientStore
        }
      }
    });
    
    // 输入患者ID
    const patientIdInput = wrapper.find('input[placeholder="输入患者ID"]');
    await patientIdInput.setValue('P123');
    
    // 触发change事件
    await patientIdInput.trigger('change');
    
    // 检查是否调用了getPatientInfo
    expect(patientStore.getPatientInfo).toHaveBeenCalledWith('P123');
    
    // 检查患者姓名是否被填充
    const patientNameInput = wrapper.find('input[placeholder="自动填充"]');
    expect(patientNameInput.element.value).toBe('John Doe');
  });
  
  it('validates required fields', async () => {
    const wrapper = mount(CaseForm, {
      props: {
        patientId: '',
        admissionDate: ''
      },
      global: {
        plugins: [createTestingPinia()]
      }
    });
    
    // 获取表单组件实例
    const formRef = wrapper.vm.$refs.caseFormRef;
    
    // Mock validate方法
    formRef.validate = vi.fn().mockRejectedValue(new Error('Validation failed'));
    
    // 尝试提交表单
    const validateResult = await wrapper.vm.validate();
    
    // 验证失败
    expect(validateResult).toBe(false);
    expect(formRef.validate).toHaveBeenCalled();
  });
  
  it('emits update events when form values change', async () => {
    const wrapper = mount(CaseForm, {
      props: {
        patientId: '',
        admissionDate: ''
      },
      global: {
        plugins: [createTestingPinia()]
      }
    });
    
    // 输入患者ID
    const patientIdInput = wrapper.find('input[placeholder="输入患者ID"]');
    await patientIdInput.setValue('P123');
    
    // 检查是否触发了update:patientId事件
    expect(wrapper.emitted('update:patientId')).toBeTruthy();
    expect(wrapper.emitted('update:patientId')[0]).toEqual(['P123']);
    
    // 选择就诊日期
    const dateInput = wrapper.find('input[type="date"]');
    await dateInput.setValue('2023-10-20');
    
    // 检查是否触发了update:admissionDate事件
    expect(wrapper.emitted('update:admissionDate')).toBeTruthy();
    expect(wrapper.emitted('update:admissionDate')[0]).toEqual(['2023-10-20']);
  });
  
  it('validates age is between 0 and 150', async () => {
    const wrapper = mount(CaseForm, {
      props: {
        patientId: 'P123',
        admissionDate: '2023-10-20'
      },
      global: {
        plugins: [createTestingPinia()]
      }
    });
    
    // 找到年龄输入框
    const ageInput = wrapper.find('input[type="number"]');
    
    // 输入无效年龄
    await ageInput.setValue(200);
    
    // 触发验证
    const validateResult = await wrapper.vm.validate();
    
    // 验证应该失败
    expect(validateResult).toBe(false);
    
    // 输入有效年龄
    await ageInput.setValue(30);
    
    // 触发验证
    const validateResult2 = await wrapper.vm.validate();
    
    // 验证应该通过
    expect(validateResult2).toBe(true);
  });
});