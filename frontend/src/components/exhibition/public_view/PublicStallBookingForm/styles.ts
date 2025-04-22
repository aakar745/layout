// Styles for the exhibition booking form
import styled from '@emotion/styled';
import { Modal, Steps, Button, Form, Input, Card, Descriptions, Typography } from 'antd';

export const StyledModal = styled(Modal)`
  .ant-modal-content {
    padding: 0;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  }
  .ant-modal-header {
    padding: 24px 32px;
    margin: 0;
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
    background: linear-gradient(to right, #4b47b9, #3f51b5);
    
    .ant-modal-title {
      color: white;
      font-weight: 600;
      font-size: 18px;
    }
  }
  .ant-modal-body {
    padding: 0;
  }
  .ant-modal-close {
    color: white;
  }
`;

export const StepsNav = styled.div`
  display: flex;
  border-bottom: 1px solid #eee;
  background-color: #f9f9fa;
  margin-bottom: 24px;
  
  .step-item {
    padding: 16px 24px;
    position: relative;
    display: flex;
    align-items: center;
    font-size: 15px;
    color: #666;
    gap: 10px;
    
    &.active {
      color: #4b47b9;
      font-weight: 500;
      
      &:after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 2px;
        background-color: #4b47b9;
      }
      
      .step-icon {
        background-color: #4b47b9;
        color: white;
      }
    }
    
    &.completed {
      .step-icon {
        background-color: #52c41a;
        color: white;
      }
    }
    
    .step-icon {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background-color: #eee;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
`;

export const StepContent = styled.div`
  padding: 24px 32px 32px;
`;

export const PageTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: #1f1f1f;
  margin-bottom: 8px;
`;

export const PageSubtitle = styled.p`
  font-size: 14px;
  color: #666;
  margin-bottom: 24px;
`;

export const FilterBar = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  
  .search-input {
    width: 240px;
    border-radius: 8px;
  }
  
  .filter-select {
    width: 160px;
    border-radius: 8px;
  }
`;

export const StallTabsContainer = styled.div`
  margin-bottom: 24px;
  
  .tab-header {
    display: flex;
    margin-bottom: 24px;
    border-bottom: 1px solid #f0f0f0;
    
    .tab-item {
      padding: 12px 24px;
      font-size: 15px;
      font-weight: 500;
      color: #666;
      cursor: pointer;
      position: relative;
      display: flex;
      align-items: center;
      gap: 8px;
      
      &.active {
        color: #4b47b9;
        
        &:after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          right: 0;
          height: 2px;
          background: #4b47b9;
          border-radius: 2px 2px 0 0;
        }
      }
      
      .badge {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background: #f0f0f0;
        color: #666;
        font-size: 12px;
        height: 20px;
        min-width: 20px;
        padding: 0 8px;
        border-radius: 10px;
        margin-left: 8px;
        
        &.active {
          background: #4b47b9;
          color: white;
        }
      }
    }
  }
`;

export const StallGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`;

export const StallCard = styled.div<{ selected?: boolean }>`
  border: 1px solid ${props => props.selected ? '#4b47b9' : '#e6e6f0'};
  background: ${props => props.selected ? 'rgba(75, 71, 185, 0.05)' : 'white'};
  border-radius: 12px;
  padding: 20px;
  padding-left: 48px;
  position: relative;
  transition: all 0.2s ease;
  box-shadow: ${props => props.selected ? '0 4px 12px rgba(75, 71, 185, 0.15)' : '0 2px 8px rgba(0, 0, 0, 0.04)'};
  cursor: pointer;
  
  &:hover {
    border-color: #4b47b9;
    box-shadow: 0 4px 12px rgba(75, 71, 185, 0.15);
    transform: translateY(-2px);
  }
  
  .stall-price {
    position: absolute;
    top: 16px;
    right: 16px;
    background: ${props => props.selected ? '#4b47b9' : '#52c41a'};
    color: white;
    font-weight: 600;
    padding: 6px 14px;
    border-radius: 20px;
    font-size: 14px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  }
  
  .stall-number {
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 8px;
    color: #1f1f1f;
    display: flex;
    align-items: center;
    
    .hall-label {
      font-size: 13px;
      color: #666;
      margin-left: 8px;
      font-weight: normal;
    }
  }
  
  .stall-details {
    display: flex;
    gap: 16px;
    margin-top: 16px;
    
    .detail-item {
      flex: 1;
      
      .label {
        font-size: 12px;
        color: #666;
        margin-bottom: 4px;
      }
      
      .value {
        font-size: 15px;
        font-weight: 500;
      }
    }
  }
  
  .selection-indicator {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 26px;
    height: 26px;
    border-radius: 50%;
    position: absolute;
    top: 50%;
    left: 12px;
    transform: translateY(-50%);
    background: ${props => props.selected ? '#4b47b9' : 'white'};
    border: 2px solid ${props => props.selected ? '#4b47b9' : '#d9d9d9'};
    color: white;
    transition: all 0.2s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

export const BookingSummaryCard = styled(Card)`
  background: #f9fafc;
  border-radius: 12px;
  margin-top: 24px;
  border: 1px solid #eaecf0;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(16, 24, 40, 0.1), 0 1px 2px rgba(16, 24, 40, 0.06);
  
  .ant-card-head {
    background: #f2f4f7;
    border-bottom-color: #eaecf0;
    padding: 16px 24px;
    min-height: 48px;
    
    .ant-card-head-title {
      padding: 0;
      font-size: 16px;
      font-weight: 600;
      color: #101828;
    }
  }
  
  .ant-card-body {
    padding: 16px 24px 24px;
  }
  
  .summary-row {
    display: flex;
    justify-content: space-between;
    padding: 12px 0;
    
    &:not(:last-child) {
      border-bottom: 1px solid #eaecf0;
    }
    
    .label {
      color: #475467;
      font-weight: 500;
    }
    
    .value {
      font-weight: 600;
      text-align: right;
      color: #1f2937;
    }
    
    &.discount {
      color: #ef4444;
      
      .value {
        color: #ef4444;
      }
    }
    
    &.total {
      font-weight: 600;
      font-size: 16px;
      color: #101828;
      border-top: 1px solid #eaecf0;
      margin-top: 8px;
      padding-top: 16px;
      
      .label, .value {
        font-size: 16px;
        font-weight: 700;
        color: #101828;
      }
    }
  }
`;

export const ActionButton = styled(Button)`
  &.ant-btn-primary {
    background: #4b47b9;
    border-color: #4b47b9;
    
    &:hover, &:focus {
      background: #3b37a9;
      border-color: #3b37a9;
    }
  }
  
  &.ant-btn-lg {
    height: 48px;
    padding: 0 24px;
    font-size: 16px;
    border-radius: 8px;
  }
`;

export const ActionBar = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
`;

export const FormCard = styled(Card)`
  background: #f8f8fc;
  border-radius: 12px;
  border: 1px solid #e6e6f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  
  .ant-card-body {
    padding: 24px;
  }
  
  .ant-form-item:last-child {
    margin-bottom: 0;
  }
`;

export const StyledInput = styled(Input)`
  &.ant-input-lg {
    border-radius: 8px;
    border: 1px solid #e6e6f0;
    background: white;
    padding: 12px 16px;
    height: auto;
    
    &:hover, &:focus {
      border-color: #4b47b9;
      box-shadow: 0 0 0 2px rgba(75, 71, 185, 0.1);
    }
  }
  
  .anticon {
    color: #4b47b9;
  }
`;

export const StyledButton = styled(Button)`
  &.ant-btn-lg {
    height: 40px;
    padding: 0 24px;
    font-size: 14px;
    border-radius: 6px;
    font-weight: 500;
    
    &.ant-btn-primary {
      background: #4b47b9;
      border-color: #4b47b9;
      
      &:hover {
        background: #3f3fa0;
        border-color: #3f3fa0;
      }
    }

    &:not(.ant-btn-primary) {
      border-color: #d9d9d9;
      
      &:hover {
        color: #4b47b9;
        border-color: #4b47b9;
      }
    }
  }
`;

export const StyledDescriptions = styled(Descriptions)`
  .ant-descriptions-item-label {
    background: #f8f8fc !important;
    font-weight: 600;
    color: #1f1f1f;
  }
  
  .ant-descriptions-item-content {
    background: white !important;
  }
`;

export const StepsSection = styled.div`
  background: #f8f8fc;
  padding: 32px 0;
  border-bottom: 1px solid #e6e6f0;
  margin: -32px -32px 32px;
`;

export const StyledSteps = styled(Steps)`
  max-width: 900px;
  margin: 0 auto;

  .ant-steps-item {
    padding: 0 12px;
    margin: 0;
    
    &:first-of-type {
      padding-left: 0;
    }
    
    &:last-of-type {
      padding-right: 0;
    }
  }

  .ant-steps-item-container {
    position: relative;
  }

  .ant-steps-item-tail {
    padding: 0;
    top: 13px;
    margin: 0;
    
    &::after {
      height: 1px;
      margin: 0;
      background: #e6e6f0;
    }
  }

  .ant-steps-item-icon {
    width: 28px;
    height: 28px;
    line-height: 28px;
    margin-right: 8px;
    font-size: 14px;
    border: none;
    background: #e6e6f0;
    
    .anticon {
      font-size: 14px;
      top: 0;
    }
  }

  .ant-steps-item-content {
    display: inline-block;
  }

  .ant-steps-item-title {
    font-size: 14px;
    line-height: 28px;
    padding-right: 8px;
    color: rgba(0, 0, 0, 0.45);
    font-weight: normal;
    
    &::after {
      height: 1px;
      top: 14px;
      background: #e6e6f0 !important;
    }
  }

  .ant-steps-item-description {
    max-width: 140px;
    font-size: 12px;
    color: rgba(0, 0, 0, 0.45);
  }

  .ant-steps-item-active {
    .ant-steps-item-icon {
      background: #4b47b9;
      border: none;
      
      .ant-steps-icon {
        color: white;
      }
    }
    
    .ant-steps-item-title {
      color: rgba(0, 0, 0, 0.85);
      font-weight: 500;
      
      &::after {
        background: #e6e6f0;
      }
    }
    
    .ant-steps-item-description {
      color: rgba(0, 0, 0, 0.65);
    }
  }

  .ant-steps-item-finish {
    .ant-steps-item-icon {
      background: #4b47b9;
      border: none;
      
      .ant-steps-icon {
        color: white;
      }
    }
    
    .ant-steps-item-title {
      color: rgba(0, 0, 0, 0.85);
      
      &::after {
        background: #4b47b9 !important;
      }
    }
    
    .ant-steps-item-tail::after {
      background: #4b47b9;
    }
  }

  .ant-steps-item-wait {
    .ant-steps-item-icon {
      background: #e6e6f0;
      border: none;
      
      .ant-steps-icon {
        color: rgba(0, 0, 0, 0.45);
      }
    }
  }
`;

export const ExhibitorOption = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 4px 0;

  .company-name {
    font-weight: 500;
    color: rgba(0, 0, 0, 0.85);
  }

  .contact-details {
    font-size: 12px;
    color: rgba(0, 0, 0, 0.45);
  }
`;

export const FormSection = styled.div`
  margin-bottom: 32px;

  &:last-child {
    margin-bottom: 0;
  }

  .section-title {
    margin-bottom: 16px;
    padding-bottom: 8px;
    border-bottom: 1px solid #e6e6f0;
  }
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
`;

export const StallDetailsGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
  margin-top: 24px;
`;

export const StallList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-height: 338px; /* Height for 3 cards: (102px × 3) + (16px × 2 gaps) */
  overflow-y: auto;
  padding-right: 8px;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f0f0f0;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 3px;
    
    &:hover {
      background: #bbb;
    }
  }
`;

export const CalculationCard = styled(Card)`
  &.ant-card {
    background: #f8f8fc;
    border: 1px solid #e6e6f0;
    border-radius: 8px;
    position: sticky;
    top: 24px;
  }

  .calculation-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;
    
    &:last-child {
      margin-bottom: 0;
    }
  }

  .total-row {
    border-top: 1px solid #e6e6f0;
    margin-top: 16px;
    padding-top: 16px;
    font-weight: 600;
  }
`; 