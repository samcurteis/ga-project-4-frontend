import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import AuthorPage from '../components/AuthorPage.js';

jest.mock('../lib/api', () => ({
  GET: jest.fn(),
  PUT: jest.fn(),
  DELETE: jest.fn(),
  ENDPOINTS: {
    singleAuthor: jest.fn((id) => `/authors/${id}`),
    singleUser: jest.fn((id) => `/users/${id}`),
  },
  getHeaders: jest.fn(() => ({})),
}));

jest.mock('../lib/auth', () => ({
  AUTH: {
    getPayload: jest.fn(() => ({ sub: 1 })),
  },
}));

jest.mock('../hooks/useAuthenticated', () => ({
  useAuthenticated: jest.fn(() => [true]),
}));

jest.mock('../lib/notifications', () => ({
  NOTIFY: {
    SUCCESS: jest.fn(),
  },
}));

describe('AuthorPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders author details', async () => {
    const singleAuthorResponse = {
      data: {
        id: 1,
        name: 'John Doe',
        favorites: [],
        poems: [{ id: 1, title: 'Poem 1' }, { id: 2, title: 'Poem 2' }],
      },
    };
    const singleUserResponse = {
      data: {
        id: 1,
        name: 'Test User',
        is_staff: false,
      },
    };
    const getSpy = jest
      .spyOn(require('../lib/api'), 'GET')
      .mockImplementation((url) => {
        if (url === '/authors/1') {
          return Promise.resolve(singleAuthorResponse);
        } else if (url === '/users/1') {
          return Promise.resolve(singleUserResponse);
        }
      });

    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/authors/1']}>
          <Route path='/authors/:id' component={AuthorPage} />
        </MemoryRouter>
      );
    });

    expect(getSpy).toHaveBeenCalledTimes(2);
    expect(getSpy).toHaveBeenCalledWith('/authors/1');
    expect(getSpy).toHaveBeenCalledWith('/users/1');

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Poem 1')).toBeInTheDocument();
    expect(screen.getByText('Poem 2')).toBeInTheDocument();
  });

  test('updates favorite when clicked', async () => {
    const singleAuthorResponse = {
      data: {
        id: 1,
        name: 'John Doe',
        favorites: [],
        poems: [{ id: 1, title: 'Poem 1' }, { id: 2, title: 'Poem 2' }],
      },
    };
    const singleUserResponse = {
      data: {
        id: 1,
        name: 'Test User',
        is_staff: false,
      },
    };
    const putSpy = jest
      .spyOn(require('../lib/api'), 'PUT')
      .mockResolvedValueOnce({ data: {} });
    const getSpy = jest
      .spyOn(require('../lib/api'), 'GET')
      .mockImplementation((url) => {
        if (url === '/authors/1') {
          return Promise.resolve(singleAuthorResponse);
        } else if (url === '/users/1') {
          return Promise.resolve(singleUserResponse);
        }
      });
  }

