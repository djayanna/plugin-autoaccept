import React from 'react';
import { VERSION } from '@twilio/flex-ui';
import { FlexPlugin } from 'flex-plugin';
import * as Flex from '@twilio/flex-ui';


import CustomTaskListContainer from './components/CustomTaskList/CustomTaskList.Container';
import reducers, { namespace } from './states';

const PLUGIN_NAME = 'AutoacceptPlugin';

export default class AutoacceptPlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  /**
   * This code is run when your plugin is being started
   * Use this to modify any UI components or attach to the actions framework
   *
   * @param flex { typeof import('@twilio/flex-ui') }
   * @param manager { import('@twilio/flex-ui').Manager }
   */
  init(flex, manager) {
    this.registerReducers(manager);

    const options = { sortOrder: -1 };
    flex.AgentDesktopView
      .Panel1
      .Content
      .add(<CustomTaskListContainer key="AutoacceptPlugin-component" />, options);

     // flex.Actions.addListener("afterAcceptTask", (payload) => {Flex.Actions.invokeAction("SelectTask", {sid: payload.sid})});

      manager.workerClient.on("reservationCreated", reservation => {    
       reservation.addListener("accepted", (reservation)=> {Flex.Actions.invokeAction("SelectTask", {sid: reservation.sid})});
       Flex.Actions.invokeAction("AcceptTask", {sid: reservation.sid});

       // Flex.Actions.invokeAction("SelectTask", {sid: reservation.sid});
      //setTimeout(()=>{Flex.Actions.invokeAction("SelectTask", {sid: reservation.sid})}, 750);
      });

      
  }

  /**
   * Registers the plugin reducers
   *
   * @param manager { Flex.Manager }
   */
  registerReducers(manager) {
    if (!manager.store.addReducer) {
      // eslint: disable-next-line
      console.error(`You need FlexUI > 1.9.0 to use built-in redux; you are currently on ${VERSION}`);
      return;
    }

    manager.store.addReducer(namespace, reducers);
  }
}
