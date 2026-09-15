import { NotificationService } from '../../src/services/notification.service';

jest.mock('../../src/config/firebase', () => ({
  isFirebaseConfigured: jest.fn(),
  getFirebaseApp: jest.fn(),
}));

import { isFirebaseConfigured, getFirebaseApp } from '../../src/config/firebase';

const mockIsConfigured = isFirebaseConfigured as jest.Mock;
const mockGetApp = getFirebaseApp as jest.Mock;

describe('NotificationService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('skips push and counts every token as failed when Firebase is not configured', async () => {
    mockIsConfigured.mockReturnValue(false);

    const result = await NotificationService.sendMulticast(['t1', 't2'], 'Title', 'Body');

    expect(result).toEqual({ successCount: 0, failureCount: 2 });
    expect(mockGetApp).not.toHaveBeenCalled();
  });

  it('sends via FCM multicast when Firebase is configured', async () => {
    const sendEachForMulticast = jest.fn().mockResolvedValue({ successCount: 1, failureCount: 0 });
    mockIsConfigured.mockReturnValue(true);
    mockGetApp.mockReturnValue({
      messaging: jest.fn().mockReturnValue({ sendEachForMulticast }),
    });

    const result = await NotificationService.sendMulticast(['tok-1'], 'Title', 'Body');

    expect(result).toEqual({ successCount: 1, failureCount: 0 });
    expect(sendEachForMulticast).toHaveBeenCalledWith({
      tokens: ['tok-1'],
      notification: { title: 'Title', body: 'Body' },
    });
  });
});