import { WACIMessageType } from '@extrimian/waci';

enum InternalTypes {
  InitDid = 'init-did',
}

export const NotificationType = {
  ...WACIMessageType,
  ...InternalTypes,
};
