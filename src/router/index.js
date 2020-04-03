import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
import Home from '../components/Home'
import ProjManager from '../components/ProjManager'
import OrgManager from '../components/OrgManager'
import ProjOpt from '../components/ProjOpt'
import ProcManager from '../components/ProcManager'
import ProcDev from '../components/ProcDev'
import ProcSimMode1 from '../components/ProcSimMode1'
import ProcSimMode2 from '../components/ProcSimMode2'
import HumanManager from '../components/HumanManager'
import EquManager from '../components/EquManager'
import PlaceManager from '../components/PlaceManager'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/projmanager',
    children: [
      { path: '/projmanager', component: ProjManager },
      { path: '/orgmanager', component: OrgManager },
      { path: '/projopt', component: ProjOpt },
      { path: '/procmanager', component: ProcManager },
      { path: '/procdev', component: ProcDev },
      { path: '/procsimmode1', component: ProcSimMode1 },
      { path: '/procsimmode2', component: ProcSimMode2 },
      { path: '/humanmanager', component: HumanManager },
      { path: '/equmanager', component: EquManager },
      { path: '/placemanager', component: PlaceManager }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
