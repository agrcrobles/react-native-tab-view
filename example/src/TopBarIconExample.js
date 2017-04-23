/* @flow */

import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TabViewAnimated, TabBar } from 'react-native-tab-view';
import type { NavigationState, Scene } from 'react-native-tab-view/types';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabbar: {
    backgroundColor: '#222',
  },
  page: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicator: {
    backgroundColor: '#ffeb3b',
  },
});

type Route = {
  key: string,
  icon: string,
};

type State = NavigationState<Route>;

export default class TopBarIconExample extends Component<void, *, State> {
  static title = 'Icon only top bar';
  static appbarElevation = 0;

  static propTypes = {
    style: View.propTypes.style,
  };

  state: State = {
    index: 0,
    routes: [
      { key: '1', icon: 'md-restaurant' },
      { key: '2', icon: 'md-bicycle' },
      { key: '3', icon: 'md-color-palette' },
    ],
  };

  _handleChangeTab = index => {
    this.setState({
      index,
    });
  };

  _renderIcon = ({ route }: Scene<Route>) => {
    return <Ionicons name={route.icon} size={24} color="white" />;
  };

  _renderHeader = props => {
    return (
      <TabBar
        {...props}
        indicatorStyle={styles.indicator}
        renderIcon={this._renderIcon}
        style={styles.tabbar}
      />
    );
  };

  _renderScene = ({ route }: Scene<Route>) => {
    switch (route.key) {
      case '1':
        return <View style={[styles.page, { backgroundColor: '#ff4081' }]} />;
      case '2':
        return <View style={[styles.page, { backgroundColor: '#673ab7' }]} />;
      case '3':
        return <View style={[styles.page, { backgroundColor: '#4caf50' }]} />;
      default:
        return null;
    }
  };

  render() {
    return (
      <TabViewAnimated
        style={[styles.container, this.props.style]}
        navigationState={this.state}
        renderScene={this._renderScene}
        renderHeader={this._renderHeader}
        onRequestChangeTab={this._handleChangeTab}
      />
    );
  }
}
