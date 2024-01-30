import { BookingStatusEnum } from '@/api/autogen';

export enum OperationEnum {
  Apply = 'apply',
  Reject = 'reject',
  Unbind = 'unbind',
}

export const StatusFilterArray = [
  {
    text: '审批通过',
    value: BookingStatusEnum.Approved,
  },
  {
    text: '审批驳回',
    value: BookingStatusEnum.Rejected,
  },
  {
    text: '申请中',
    value: BookingStatusEnum.Progressing,
  },
  {
    text: '已解除',
    value: BookingStatusEnum.Released,
  },
] as const;

export const StatusMap = new Map<BookingStatusEnum, string>(StatusFilterArray.map(item => [item.value, item.text]));
