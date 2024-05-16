import Routes from '../../models/routes.model';
import RouterService from './router.service';

describe('RouterService', () => {
  let service: RouterService;
  const originalLocation = window;
  const eventRegistry = new Map();
  const mokedApp = {
    render: () => {},
  };
  const location = { pathname: 'test' };
  Object.defineProperty(globalThis, 'window', {
    value: {
      location,
      history: { pushState: () => {} },
      addEventListener: (type: string, cb: () => void) => {
        eventRegistry.set(type, cb);
      },
      dispatchEvent: (event: Event) => {
        const cb = eventRegistry.get(event.type);
        if (cb) {
          cb();
        }
      },
    },
    writable: true,
  });

  beforeEach(() => {
    service = new RouterService(mokedApp);
  });

  afterAll(() => {
    Object.defineProperty(globalThis, 'window', {
      value: originalLocation,
    });
    jest.restoreAllMocks();
  });

  test('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('on initial load if provided URL', () => {
    const renderSpy = jest.spyOn(mokedApp, 'render');

    test('valid should navigate on provided URL', () => {
      location.pathname = Routes.Login;
      service.init();
      expect(renderSpy).toHaveBeenCalledWith(Routes.Login);
    });

    test('not valid should navigate on 404 page', () => {
      location.pathname = 'test';
      service.init();
      expect(renderSpy).toHaveBeenCalledWith(Routes.NotFound);
    });
  });

  test('should navigate on back URL on going back', () => {
    const event = new Event('popstate');
    const renderSpy = jest.spyOn(mokedApp, 'render');
    window.dispatchEvent(event);
    expect(renderSpy).toHaveBeenCalled();
  });
});
