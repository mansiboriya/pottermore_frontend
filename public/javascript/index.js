import React from 'react'
import { render } from 'react-dom'
import App from './../../components/App'
import Slytherin from './../../components/Slytherin'
import Hufflepuff from './../../components/Hufflepuff'
import Ravenclaw from './../../components/Ravenclaw'
import Gryffindor from './../../components/Gryffindor'

let component1 = document.getElementById('App');
let component2 = document.getElementById('Slytherin');
let component3 = document.getElementById('Hufflepuff');
let component4 = document.getElementById('Ravenclaw');
let component5 = document.getElementById('Gryffindor');

if (component1)
  render(<App />, component1);

if (component2)
  render(<Slytherin />, component2)

if (component3)
 render(<Hufflepuff />, component3);

if (component4)
  render(<Ravenclaw />, component4)

if (component5)
  render(<Gryffindor />, component5)
