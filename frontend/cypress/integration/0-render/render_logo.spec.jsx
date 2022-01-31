import React from 'react';
import { mount } from '@cypress/react';
import App from "../../../src/App";

describe("app", () => {
  it('should render logo', () => {
    mount(<App />);
    cy.get('#imgLogo').should('be.visible');
  });
})
