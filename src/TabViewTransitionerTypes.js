/* @flow */

import type { NavigationState, Layout } from './TabViewTypeDefinitions';

export type TransitionProps = {
  progress: number,
};

export type TransitionSpec = {
  timing: Function,
};

export type TransitionConfigurator = (
  currentTransitionProps: TransitionProps,
  nextTransitionProps: TransitionProps,
) => ?TransitionSpec;

export type TransitionerProps<T> = {
  navigationState: NavigationState<T>,
  configureTransition?: TransitionConfigurator,
  onRequestChangeTab: (index: number) => void,
  onChangePosition?: (value: number) => void,
  initialLayout?: Layout,
  canJumpToTab?: (route: T) => boolean,
};
