import React, { useState } from 'react';
import { Text } from 'react-native';

import { store } from '../global-state/router-store';
import { router } from '../imperative-api';
import Stack from '../layouts/Stack';
import { act, renderRouter, screen } from '../testing-library';

it('should protect routes during the initial load', () => {
  let useStateResult;

  renderRouter(
    {
      _layout: function Layout() {
        useStateResult = useState(false);
        return (
          <Stack id={undefined}>
            <Stack.Protected guard={useStateResult[0]}>
              <Stack.Screen name="a" />
            </Stack.Protected>
          </Stack>
        );
      },
      index: () => {
        return <Text testID="index">index</Text>;
      },
      a: () => <Text testID="a">a</Text>,
      b: () => <Text testID="b">B</Text>,
      c: () => <Text testID="c">C</Text>,
    },
    { initialUrl: '/a' }
  );

  expect(store.rootStateSnapshot()).toStrictEqual({
    index: 0,
    key: expect.any(String),
    preloadedRoutes: [],
    routeNames: ['__root'],
    routes: [
      {
        key: expect.any(String),
        name: '__root',
        params: undefined,
        state: {
          index: 0,
          key: expect.any(String),
          preloadedRoutes: [],
          routeNames: ['index', 'b', 'c', '_sitemap', '+not-found'], // a should not be a possible route
          routes: [
            {
              key: expect.any(String),
              name: 'index',
              params: undefined,
            },
          ],
          stale: false,
          type: 'stack',
        },
      },
    ],
    stale: false,
    type: 'stack',
  });

  expect(screen.getByTestId('index')).toBeVisible();

  // Enable the /a route
  act(() => {
    useStateResult[1](true);
  });

  // Now we should be able to navigate to /a
  // TODO: Allow navigation events while updating state
  act(() => router.replace('/a'));

  expect(screen.getByTestId('a')).toBeVisible();
  expect(store.rootStateSnapshot()).toStrictEqual({
    index: 0,
    key: expect.any(String),
    preloadedRoutes: [],
    routeNames: ['__root'],
    routes: [
      {
        key: expect.any(String),
        name: '__root',
        params: undefined,
        state: {
          index: 0,
          key: expect.any(String),
          preloadedRoutes: [],
          routeNames: ['a', 'index', 'b', 'c', '_sitemap', '+not-found'],
          routes: [
            {
              key: expect.any(String),
              name: 'a',
              params: {},
            },
          ],
          stale: false,
          type: 'stack',
        },
      },
    ],
    stale: false,
    type: 'stack',
  });
});

it.skip('should default to anchor during initial load', () => {
  let useStateResult;

  renderRouter(
    {
      _layout: {
        unstable_settings: {
          anchor: 'b',
        },
        default: function Layout() {
          useStateResult = useState(false);
          return (
            <Stack id={undefined}>
              <Stack.Protected guard={useStateResult[0]}>
                <Stack.Screen name="a" />
              </Stack.Protected>

              <Stack.Screen name="b" />
            </Stack>
          );
        },
      },
      index: () => {
        return <Text testID="index">index</Text>;
      },
      a: () => <Text testID="a">a</Text>,
      b: () => <Text testID="b">B</Text>,
    },
    { initialUrl: '/a' }
  );

  expect(store.rootStateSnapshot()).toStrictEqual({
    index: 0,
    key: expect.any(String),
    preloadedRoutes: [],
    routeNames: ['__root'],
    routes: [
      {
        key: expect.any(String),
        name: '__root',
        params: undefined,
        state: {
          index: 0,
          key: expect.any(String),
          preloadedRoutes: [],
          routeNames: ['b', 'index', 'c', '_sitemap', '+not-found'], // a should not be a possible route
          routes: [
            {
              key: expect.any(String),
              name: 'b',
              params: undefined,
            },
          ],
          stale: false,
          type: 'stack',
        },
      },
    ],
    stale: false,
    type: 'stack',
  });

  expect(screen.getByTestId('b')).toBeVisible();

  // Enable the /a route
  act(() => {
    useStateResult[1](true);
  });

  // Now we should be able to navigate to /a
  // TODO: Allow navigation events while updating state
  act(() => router.replace('/a'));

  expect(screen.getByTestId('a')).toBeVisible();
  expect(store.rootStateSnapshot()).toStrictEqual({
    index: 0,
    key: expect.any(String),
    preloadedRoutes: [],
    routeNames: ['__root'],
    routes: [
      {
        key: expect.any(String),
        name: '__root',
        params: undefined,
        state: {
          index: 0,
          key: expect.any(String),
          preloadedRoutes: [],
          routeNames: ['a', 'b', 'index', 'c', '_sitemap', '+not-found'],
          routes: [
            {
              key: expect.any(String),
              name: 'a',
              params: {},
            },
          ],
          stale: false,
          type: 'stack',
        },
      },
    ],
    stale: false,
    type: 'stack',
  });
});
