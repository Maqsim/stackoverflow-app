import { gsap } from 'gsap';
import { PixiPlugin } from 'gsap/PixiPlugin';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { renderLoader } from '../src/uitls/render-loader';

gsap.registerPlugin(PixiPlugin, MotionPathPlugin);

const width = window.innerWidth;
const height = window.innerHeight;

renderLoader({ element: document.body, width, height });
