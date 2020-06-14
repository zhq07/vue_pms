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
import EquipManager from '../components/EquipManager'
import PlaceManager from '../components/PlaceManager'
import KnowlManager from '../components/KnowlManager'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/projManager',
    children: [
      { path: '/projManager', component: ProjManager },
      { path: '/orgManager', component: OrgManager },
      { path: '/projOpt', component: ProjOpt },
      { path: '/procManager', component: ProcManager },
      { path: '/procDev', component: ProcDev },
      { path: '/procSimMode1', component: ProcSimMode1 },
      { path: '/procSimMode2', component: ProcSimMode2 },
      { path: '/humanManager', component: HumanManager },
      { path: '/equipManager', component: EquipManager },
      { path: '/placeManager', component: PlaceManager },
      { path: '/knowlManager', component: KnowlManager }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
