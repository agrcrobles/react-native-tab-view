/* @flow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Platform, View, StyleSheet } from 'react-native';
import TabViewTransitioner from './TabViewTransitioner';
import { NavigationStatePropType } from './TabViewPropTypes';
import type { Scene, SceneRendererProps } from './TabViewTypeDefinitions';
import type { TransitionerProps } from './TabViewTransitionerTypes';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
});

type DefaultProps<T> = {
  renderPager: (props: SceneRendererProps<T>) => React.Element<*>,
};

type RenderProps<T> = {
  renderPager: (props: SceneRendererProps<T>) => React.Element<*>,
  renderScene: (props: SceneRendererProps<T> & Scene<T>) => ?React.Element<*>,
  renderHeader?: (props: SceneRendererProps<T>) => ?React.Element<*>,
  renderFooter?: (props: SceneRendererProps<T>) => ?React.Element<*>,
  lazy?: boolean,
};

type Props<T> = TransitionerProps<T> & RenderProps<T>;

type State = {
  loaded: Array<number>,
};

let TabViewPager;

switch (Platform.OS) {
  case 'android':
    TabViewPager = require('./TabViewPagerAndroid').default;
    break;
  case 'ios':
    TabViewPager = require('./TabViewPagerScroll').default;
    break;
  default:
    TabViewPager = require('./TabViewPagerPan').default;
    break;
}

export default class TabViewAnimated<T>
  extends PureComponent<DefaultProps<T>, Props<T>, State> {
  static propTypes = {
    navigationState: NavigationStatePropType.isRequired,
    renderPager: PropTypes.func.isRequired,
    renderScene: PropTypes.func.isRequired,
    renderHeader: PropTypes.func,
    renderFooter: PropTypes.func,
    onChangePosition: PropTypes.func,
    lazy: PropTypes.bool,
  };

  static defaultProps = {
    renderPager: (props: SceneRendererProps<T>) => <TabViewPager {...props} />,
  };

  constructor(props: Props<T>) {
    super(props);

    this.state = {
      loaded: [this.props.navigationState.index],
    };
  }

  state: State;

  _renderScene = (props: SceneRendererProps<T>) => {
    const { renderScene, lazy } = this.props;
    const { navigationState } = props;
    const { loaded } = this.state;
    if (lazy) {
      if (loaded.includes(navigationState.routes.indexOf(props.route))) {
        return renderScene(props);
      }
      return null;
    }
    return renderScene(props);
  };

  _renderItems = (props: SceneRendererProps<T>) => {
    const {
      navigationState: _,
      configureTransition,
      onRequestChangeTab,
      onChangePosition,
      canJumpToTab,
      lazy,
      initialLayout,
      renderPager,
      renderHeader,
      renderFooter,
      renderScene,
      ...rest
    } = this.props;
    const { navigationState } = props;

    return (
      <View style={styles.container}>
        {renderHeader && renderHeader(props)}
        {renderPager({
          ...props,
          ...rest,
          children: navigationState.routes.map((route, index) =>
            this._renderScene({
              ...props,
              route,
              index,
              focused: index === navigationState.index,
            }),
          ),
        })}
        {renderFooter && renderFooter(props)}
      </View>
    );
  };

  _handleChangePosition = (value: number) => {
    const { onChangePosition, navigationState, lazy } = this.props;
    if (onChangePosition) {
      onChangePosition(value);
    }
    const { loaded } = this.state;
    if (lazy) {
      let next = Math.ceil(value);
      if (next === navigationState.index) {
        next = Math.floor(value);
      }
      if (loaded.includes(next)) {
        return;
      }
      this.setState({
        loaded: [...loaded, next],
      });
    }
  };

  render() {
    return (
      <TabViewTransitioner
        {...this.props}
        loaded={this.state.loaded}
        onChangePosition={this._handleChangePosition}
        render={this._renderItems}
      />
    );
  }
}
