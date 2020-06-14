<template>
  <el-container direction="vertical">
    <el-page-header @back="goBack" :content="currProc.procName" style="margin: 10px 0px"></el-page-header>
    <!--    上半部分-->
    <el-container class="up-container">
      <el-main class="up-main">
        <el-table
          :data="taskList"
          height="100%"
          row-key="pmsTask.taskUid"
          :default-sort="{ prop: 'pmsTask.taskId' }"
          :header-cell-style="{'text-align':'center', background:'#ddd'}"
          highlight-current-row
          border>
          <el-table-column type="index" prop="pmsTask.taskId" label="编号" align="center" width="70">
            <template slot-scope="scope">
              <span v-if="scope.row.isSet">
                <el-input size="mini" placeholder="编号" v-model="currTask.pmsTask.taskId"></el-input>
              </span>
              <span v-else>{{ scope.row.pmsTask.taskId }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="pmsTask.taskName" label="任务名称" align="center" width="160">
            <template slot-scope="scope">
              <span v-if="scope.row.isSet">
                <el-input size="mini" placeholder="任务名称" v-model="currTask.pmsTask.taskName"></el-input>
              </span>
              <span v-else>{{ scope.row.pmsTask.taskName }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="pmsTask.taskPlanStartDateTime" label="计划开始" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.isSet">
                <el-date-picker
                  size="mini"
                  clearable
                  v-model="currTask.pmsTask.taskPlanStartDateTime"
                  type="datetime"
                  :default-time="'08:00:00'"
                  format="yyyy-MM-dd HH:mm"
                  placeholder="计划开始">
                </el-date-picker>
              </span>
              <span v-else>{{ datetimeFormat(scope.row.pmsTask.taskPlanStartDateTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="pmsTask.taskPlanFinishDateTime" label="计划结束" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.isSet">
                <el-date-picker
                  size="mini"
                  clearable
                  v-model="currTask.pmsTask.taskPlanFinishDateTime"
                  type="datetime"
                  :default-time="'08:00:00'"
                  format="yyyy-MM-dd HH:mm"
                  placeholder="计划结束">
                </el-date-picker>
              </span>
              <span v-else>{{ datetimeFormat(scope.row.pmsTask.taskPlanFinishDateTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="pmsTask.taskPlanDur" label="工期" align="center" width="90">
            <template slot-scope="scope">
              <span v-if="scope.row.isSet">
                <el-input size="mini" placeholder="工期" clearable v-model="currTask.pmsTask.taskPlanDur"></el-input>
              </span>
              <span v-else>{{ scope.row.pmsTask.taskPlanDur }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="pmsTask.taskEarlyStartDateTime" label="最早开始" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.isSet">
                <el-date-picker
                  v-model="currTask.pmsTask.taskEarlyStartDateTime"
                  type="datetime"
                  :default-time="'08:00:00'"
                  format="yyyy-MM-dd HH:mm"
                  placeholder="最早开始">
                </el-date-picker>
              </span>
              <span v-else>{{ datetimeFormat(scope.row.pmsTask.taskEarlyStartDateTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="pmsTask.taskLateFinishDateTime" label="最晚结束" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.isSet">
                <el-date-picker
                  v-model="currTask.pmsTask.taskLateFinishDateTime"
                  type="datetime"
                  :default-time="'08:00:00'"
                  format="yyyy-MM-dd HH:mm"
                  placeholder="最晚结束">
                </el-date-picker>
              </span>
              <span v-else>{{ datetimeFormat(scope.row.pmsTask.taskLateFinishDateTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="taskNormalPreTasks" :formatter="taskNormalPreTasksFormat" label="紧前任务" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.isSet">
                <el-select size="mini" value-key="taskUid" v-model="currTask.taskNormalPreTasks" multiple clearable filterable placeholder="紧前任务">
                  <el-option
                    v-for="preTask in taskList"
                    :key="preTask.pmsTask.taskUid"
                    :label="preTask.pmsTask.taskName"
                    :value="preTask.pmsTask">
                  </el-option>
                </el-select>
              </span>
              <span v-else>{{ taskNormalPreTasksFormat(scope.row) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="taskRealPreTasks" :formatter="taskRealPreTasksFormat" label="真紧前任务" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.isSet">
                <el-select size="mini" value-key="taskUid" v-model="currTask.taskRealPreTasks" multiple clearable filterable placeholder="真紧前任务">
                  <el-option
                    v-for="preTask in taskList"
                    :key="preTask.pmsTask.taskUid"
                    :label="preTask.pmsTask.taskName"
                    :value="preTask.pmsTask">
                  </el-option>
                </el-select>
              </span>
              <span v-else>{{ taskRealPreTasksFormat(scope.row) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="pmsTask.taskInType" :formatter="taskInTypeFormat" label="输入类型" align="center" width="90">
            <template slot-scope="scope">
              <span v-if="scope.row.isSet">
                <el-select size="mini" v-model="currTask.pmsTask.taskInType" clearable filterable placeholder="输入类型">
                  <el-option
                    v-for="inType in taskInTypeOptions"
                    :key="inType.value"
                    :label="inType.label"
                    :value="inType.value">
                  </el-option>
                </el-select>
              </span>
              <span v-else>{{ taskInTypeFormat(scope.row) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="pmsTask.taskOutType" :formatter="taskOutTypeFormat" label="输出类型" align="center" width="90">
            <template slot-scope="scope">
              <span v-if="scope.row.isSet">
                <el-select size="mini" v-model="currTask.pmsTask.taskOutType" clearable filterable placeholder="输出类型">
                  <el-option
                    v-for="outType in taskOutTypeOptions"
                    :key="outType.value"
                    :label="outType.label"
                    :value="outType.value">
                  </el-option>
                </el-select>
              </span>
              <span v-else>{{ taskOutTypeFormat(scope.row) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="pmsTask.taskWorkModel" :formatter="taskWorkModelFormat" label="执行模式" align="center" width="90">
            <template slot-scope="scope">
              <span v-if="scope.row.isSet">
                <el-select size="mini" v-model="currTask.pmsTask.taskWorkModel" clearable filterable placeholder="执行模式">
                  <el-option
                    v-for="workModel in taskWorkModelOptions"
                    :key="workModel.value"
                    :label="workModel.label"
                    :value="workModel.value">
                  </el-option>
                </el-select>
              </span>
              <span v-else>{{ taskWorkModelFormat(scope.row) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="pmsTask.taskType" :formatter="taskTypeFormat" label="任务类型" align="center" width="90">
            <template slot-scope="scope">
              <span v-if="scope.row.isSet">
                <el-select size="mini" v-model="currTask.pmsTask.taskType" clearable placeholder="任务类型">
                  <el-option
                    v-for="taskType in taskTypeOptions"
                    :key="taskType.value"
                    :label="taskType.label"
                    :value="taskType.value">
                  </el-option>
                </el-select>
              </span>
              <span v-else>{{ taskTypeFormat(scope.row) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="pmsTask.taskPriority" :formatter="taskPriorityFormat" label="优先级" align="center" width="90">
            <template slot-scope="scope">
              <span v-if="scope.row.isSet">
                <el-select size="mini" v-model="currTask.pmsTask.taskPriority" clearable placeholder="优先级">
                  <el-option
                    v-for="taskPriority in taskPriorityOptions"
                    :key="taskPriority.value"
                    :label="taskPriority.label"
                    :value="taskPriority.value">
                  </el-option>
                </el-select>
              </span>
              <span v-else>{{ taskPriorityFormat(scope.row) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="140">
            <template slot="header">
              <div style="background-color: #ddd; color: #909399;">
                <span @click="addTask()">添加 </span><span @click="updatePmsTaskIds()">/ 编号</span>
              </div>
            </template>
            <template slot-scope="scope">
              <span class="el-tag el-tag--plain el-tag--info el-tag--mini" style="cursor: pointer;" @click="editTask(scope.row, scope.$index, true)">
                {{ scope.row.isSet ? '保存' : '修改' }}
              </span>
              <span class="el-tag el-tag--plain el-tag--mini" style="cursor: pointer;" @click="resPlan(scope.row)">资源</span>
              <span v-if="!scope.row.isSet" class="el-tag el-tag--plain el-tag--danger el-tag--mini" style="cursor: pointer;" @click="deleteTask(scope.row)">删除</span>
              <span v-else class="el-tag el-tag--plain el-tag--mini" style="cursor: pointer;" @click="editTask(scope.row, scope.$index, false)">取消</span>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
    </el-container>
    <!--    分割上下-->
    <div style="width: 100%; height: 10px; background-color: #D6E8F7"></div>
    <!--    下半部分-->
    <el-container class="down-container">
      <el-aside width="15%">
        <div class="el-table-up-head" style="width: 100%;">
          <span>{{ this.currTask.pmsTask.taskName }}（方案{{ this.currTaskResPlan.resPlanId }}）</span>
        </div>
        <el-table
          :data="taskResPlanList"
          height="398px"
          row-key="resPlanUid"
          :default-sort="{ prop: 'resPlanId' }"
          :header-cell-style="{'text-align':'center', background:'#ddd'}"
          highlight-current-row
          border>
          <el-table-column type="index" prop="resPlanId" label="编号" align="center" width="65">
            <template slot-scope="scope">
              <span v-if="scope.row.isSet">
                <el-input size="mini" placeholder="编号" v-model="currTaskResPlan.resPlanId"></el-input>
              </span>
              <span v-else>{{ scope.row.resPlanId }}</span>
            </template>
          </el-table-column>
<!--          <el-table-column label="所属任务" align="center">-->
<!--            <template>-->
<!--              <span v-if="Object.keys(currTask).length !== 0">{{ this.currTask.pmsTask.taskName }}</span>-->
<!--            </template>-->
<!--          </el-table-column>-->
          <el-table-column prop="resPlanPriority" label="优先级" align="center" width="65">
            <template slot-scope="scope">
              <span v-if="scope.row.isSet">
                <el-input size="mini" placeholder="优先级" v-model="currTaskResPlan.resPlanPriority"></el-input>
              </span>
              <span v-else>{{ scope.row.resPlanPriority }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot="header">
              <div style="background-color: #ddd; color: #909399;">
                <span @click="addTaskResPlan()">添加资源方案</span>
              </div>
            </template>
            <template slot-scope="scope">
              <span class="el-tag el-tag--plain el-tag--info el-tag--mini" style="cursor: pointer;" @click="editTaskResPlan(scope.row, scope.$index, true)">
                {{ scope.row.isSet ? '保存' : '修改' }}
              </span>
              <span class="el-tag el-tag--plain el-tag--mini" style="cursor: pointer;" @click="devTaskResPlan(scope.row)">编制</span>
              <span v-if="!scope.row.isSet" class="el-tag el-tag--plain el-tag--danger el-tag--mini" style="cursor: pointer;" @click="deleteTaskResPlan(scope.row)">删除</span>
              <span v-else class="el-tag el-tag--plain el-tag--mini" style="cursor: pointer;" @click="editTaskResPlan(scope.row, scope.$index, false)">取消</span>
            </template>
          </el-table-column>
        </el-table>
      </el-aside>
      <!--    分割左中-->
      <div style="width: 10px; height: 100%; background-color: #D6E8F7"></div>
      <!--    侧边-->
      <el-aside class="down-middle-aside" width="250px">
        <el-card :body-style="{ padding: '14px' }">
          <span @click="getAllEquipClick" style="cursor: pointer;">查看全部</span>
        </el-card>
        <el-tree :expand-on-click-node="false" node-key="orgUid" default-expand-all :data="orgListTree" :props="OrgTreeProps" @node-click="OrgTreeNodeClick"></el-tree>
      </el-aside>
      <!--    下本部分主体-->
      <el-main class="down-main">
        <el-tabs v-model="activeTagName" type="card">
          <el-tab-pane label="人员" name="human">
            <el-table
              :data="humList"
              height="390px"
              row-key="humUid"
              :header-cell-style="{'text-align':'center', background:'#ddd'}"
              highlight-current-row
              border>
              <el-table-column prop="humId" label="编号" align="center" sortable width="100"></el-table-column>
              <el-table-column prop="humName" label="姓名" align="center" width="90"></el-table-column>
<!--              <el-table-column prop="humPosition" label="职位" align="center" width="110"></el-table-column>-->
              <el-table-column prop="humAbilityType" label="能力" align="center"></el-table-column>
              <el-table-column prop="humAbilityLevel" label="职称" align="center" width="100"></el-table-column>
              <el-table-column label="操作" align="center" width="70">
                <template slot="header">
                  <div style="background-color: #ddd; color: #909399; cursor: pointer;">添加</div>
                </template>
                <template slot-scope="scope">
                  <el-button
                    type="primary" plain round
                    icon="el-icon-plus"
                    size="mini"
                    @click="addResReq(scope.row)">
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="设备" name="equip">
            <el-table
              :data="equipList"
              height="390px"
              row-key="equipUid"
              :header-cell-style="{'text-align':'center', background:'#ddd'}"
              highlight-current-row
              border>
              <el-table-column prop="equipId" label="编号" align="center" sortable width="100"></el-table-column>
              <el-table-column prop="equipName" label="名称" align="center"></el-table-column>
              <el-table-column prop="equipCapType" label="类型" align="center"></el-table-column>
              <el-table-column prop="equipCapLevel" label="规格" align="center"></el-table-column>
              <el-table-column label="操作" align="center" width="70">
                <template slot="header">
                  <div style="background-color: #ddd; color: #909399; cursor: pointer;">添加</div>
                </template>
                <template slot-scope="scope">
                  <el-button
                    type="primary" plain round
                    icon="el-icon-plus"
                    size="mini"
                    @click="addResReq(scope.row)">
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="场地" name="place">
            <el-table
              :data="placeList"
              row-key="placeUid"
              height="390px"
              :header-cell-style="{'text-align':'center', background:'#ddd'}"
              highlight-current-row
              border>
              <el-table-column prop="placeId" label="编号" align="center" sortable width="100"></el-table-column>
              <el-table-column prop="placeName" label="名称" align="center"></el-table-column>
              <el-table-column prop="placeType" :formatter="placeTypeFormat" label="类型" align="center" width="80"></el-table-column>
              <el-table-column prop="placeArea" label="面积" align="center" width="80"></el-table-column>
              <el-table-column label="操作" align="center" width="70">
                <template slot="header">
                  <div style="background-color: #ddd; color: #909399; cursor: pointer;">添加</div>
                </template>
                <template slot-scope="scope">
                  <el-button
                    type="primary" plain round
                    icon="el-icon-plus"
                    size="mini"
                    @click="addResReq(scope.row)">
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="知识" name="know">知识</el-tab-pane>
        </el-tabs>
      </el-main>
      <!--    分割中右-->
      <div style="width: 10px; height: 100%; background-color: #D6E8F7"></div>
      <el-aside width="45%">
        <el-tabs v-model="activeTagName" type="card">
          <el-tab-pane label="人员" name="human">
            <el-table
              :data="resReqHumList"
              height="390px"
              row-key="resReqUid"
              :default-sort="{ prop: 'resId' }"
              :header-cell-style="{'text-align':'center', background:'#ddd'}"
              highlight-current-row
              border>
              <el-table-column prop="resId" sortable label="编号" align="center" width="90"></el-table-column>
              <el-table-column prop="resName" label="名称" align="center"></el-table-column>
              <el-table-column prop="resAbilityType" :formatter="resAbilityTypeFormat" label="能力" align="center" width="110"></el-table-column>
              <el-table-column prop="resReqResStartDateTime" label="占用开始" align="center" width="100">
                <template slot-scope="scope">
                  <span v-if="scope.row.isSet">
                    <el-date-picker
                      size="mini"
                      clearable
                      v-model="currResReq.resReqResStartDateTime"
                      type="datetime"
                      :default-time="'08:00:00'"
                      format="yyyy-MM-dd HH:mm"
                      placeholder="占用开始">
                    </el-date-picker>
                  </span>
                  <span v-else>{{ datetimeFormat(scope.row.resReqResStartDateTime) }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="resReqResFinishDateTime" label="占用结束" align="center" width="100">
                <template slot-scope="scope">
                  <span v-if="scope.row.isSet">
                    <el-date-picker
                      size="mini"
                      clearable
                      v-model="currResReq.resReqResFinishDateTime"
                      type="datetime"
                      :default-time="'08:00:00'"
                      format="yyyy-MM-dd HH:mm"
                      placeholder="占用结束">
                    </el-date-picker>
                  </span>
                  <span v-else>{{ datetimeFormat(scope.row.resReqResFinishDateTime) }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="resReqResWork" label="工时/天" align="center" width="90">
                <template slot-scope="scope">
                  <span v-if="scope.row.isSet">
                    <el-input size="mini" placeholder="工时" clearable v-model="currResReq.resReqResWork"></el-input>
                  </span>
                  <span v-else>{{ scope.row.resReqResWork }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="resReqResWorkModel" :formatter="resWorkModelFormat" label="执行模式" align="center" width="90">
                <template slot-scope="scope">
                  <span v-if="scope.row.isSet">
                    <el-select size="mini" v-model="currResReq.resReqResWorkModel" clearable filterable placeholder="执行模式">
                      <el-option
                        v-for="workModel in taskWorkModelOptions"
                        :key="workModel.value"
                        :label="workModel.label"
                        :value="workModel.value">
                      </el-option>
                    </el-select>
                  </span>
                  <span v-else>{{ resWorkModelFormat(scope.row) }}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="100">
                <template slot-scope="scope">
                  <span class="el-tag el-tag--plain el-tag--info el-tag--mini" style="cursor: pointer;" @click="editResReq(scope.row, scope.$index, true)">
                    {{ scope.row.isSet ? '保存' : '修改' }}
                  </span>
                  <span v-if="!scope.row.isSet" class="el-tag el-tag--plain el-tag--danger el-tag--mini" style="cursor: pointer;" @click="deleteResReq(scope.row)">删除</span>
                  <span v-else class="el-tag el-tag--plain el-tag--mini" style="cursor: pointer;" @click="editResReq(scope.row, scope.$index, false)">取消</span>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="设备" name="equip">
            <el-table
              :data="resReqEquipList"
              height="390px"
              row-key="resReqUid"
              :default-sort="{ prop: 'resId' }"
              :header-cell-style="{'text-align':'center', background:'#ddd'}"
              highlight-current-row
              border>
              <el-table-column prop="resId" sortable label="编号" align="center" width="100"></el-table-column>
              <el-table-column prop="resName" label="名称" align="center"></el-table-column>
              <el-table-column prop="resAbilityType" :formatter="resAbilityTypeFormat" label="能力" align="center" width="110"></el-table-column>
              <el-table-column prop="resReqResStartDateTime" label="占用开始" align="center" width="100">
                <template slot-scope="scope">
                  <span v-if="scope.row.isSet">
                    <el-date-picker
                      size="mini"
                      clearable
                      v-model="currResReq.resReqResStartDateTime"
                      type="datetime"
                      :default-time="'08:00:00'"
                      format="yyyy-MM-dd HH:mm"
                      placeholder="占用开始">
                    </el-date-picker>
                  </span>
                  <span v-else>{{ datetimeFormat(scope.row.resReqResStartDateTime) }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="resReqResFinishDateTime" label="占用结束" align="center" width="100">
                <template slot-scope="scope">
                  <span v-if="scope.row.isSet">
                    <el-date-picker
                      size="mini"
                      clearable
                      v-model="currResReq.resReqResFinishDateTime"
                      type="datetime"
                      :default-time="'08:00:00'"
                      format="yyyy-MM-dd HH:mm"
                      placeholder="占用结束">
                    </el-date-picker>
                  </span>
                  <span v-else>{{ datetimeFormat(scope.row.resReqResFinishDateTime) }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="resReqResWork" label="工时/天" align="center" width="90">
                <template slot-scope="scope">
                  <span v-if="scope.row.isSet">
                    <el-input size="mini" placeholder="工时" clearable v-model="currResReq.resReqResWork"></el-input>
                  </span>
                  <span v-else>{{ scope.row.resReqResWork }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="resReqResWorkModel" :formatter="resWorkModelFormat" label="执行模式" align="center" width="90">
                <template slot-scope="scope">
                  <span v-if="scope.row.isSet">
                    <el-select size="mini" v-model="currResReq.resReqResWorkModel" clearable filterable placeholder="执行模式">
                      <el-option
                        v-for="workModel in taskWorkModelOptions"
                        :key="workModel.value"
                        :label="workModel.label"
                        :value="workModel.value">
                      </el-option>
                    </el-select>
                  </span>
                  <span v-else>{{ resWorkModelFormat(scope.row) }}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="100">
                <template slot-scope="scope">
                  <span class="el-tag el-tag--plain el-tag--info el-tag--mini" style="cursor: pointer;" @click="editResReq(scope.row, scope.$index, true)">
                    {{ scope.row.isSet ? '保存' : '修改' }}
                  </span>
                  <span v-if="!scope.row.isSet" class="el-tag el-tag--plain el-tag--danger el-tag--mini" style="cursor: pointer;" @click="deleteResReq(scope.row)">删除</span>
                  <span v-else class="el-tag el-tag--plain el-tag--mini" style="cursor: pointer;" @click="editResReq(scope.row, scope.$index, false)">取消</span>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="场地" name="place">
            <el-table
              :data="resReqPlaceList"
              height="390px"
              row-key="resReqUid"
              :default-sort="{ prop: 'resId' }"
              :header-cell-style="{'text-align':'center', background:'#ddd'}"
              highlight-current-row
              border>
              <el-table-column prop="resId" sortable label="编号" align="center" width="100"></el-table-column>
              <el-table-column prop="resName" label="名称" align="center"></el-table-column>
              <el-table-column prop="resAbilityType" :formatter="resAbilityTypeFormat" label="能力" align="center" width="110"></el-table-column>
              <el-table-column prop="resReqResStartDateTime" label="占用开始" align="center" width="100">
                <template slot-scope="scope">
                  <span v-if="scope.row.isSet">
                    <el-date-picker
                      size="mini"
                      clearable
                      v-model="currResReq.resReqResStartDateTime"
                      type="datetime"
                      :default-time="'08:00:00'"
                      format="yyyy-MM-dd HH:mm"
                      placeholder="占用开始">
                    </el-date-picker>
                  </span>
                  <span v-else>{{ datetimeFormat(scope.row.resReqResStartDateTime) }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="resReqResFinishDateTime" label="占用结束" align="center" width="100">
                <template slot-scope="scope">
                  <span v-if="scope.row.isSet">
                    <el-date-picker
                      size="mini"
                      clearable
                      v-model="currResReq.resReqResFinishDateTime"
                      type="datetime"
                      :default-time="'08:00:00'"
                      format="yyyy-MM-dd HH:mm"
                      placeholder="占用结束">
                    </el-date-picker>
                  </span>
                  <span v-else>{{ datetimeFormat(scope.row.resReqResFinishDateTime) }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="resReqResWork" label="工时/天" align="center" width="90">
                <template slot-scope="scope">
                  <span v-if="scope.row.isSet">
                    <el-input size="mini" placeholder="工时" clearable v-model="currResReq.resReqResWork"></el-input>
                  </span>
                  <span v-else>{{ scope.row.resReqResWork }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="resReqResWorkModel" :formatter="resWorkModelFormat" label="执行模式" align="center" width="90">
                <template slot-scope="scope">
                  <span v-if="scope.row.isSet">
                    <el-select size="mini" v-model="currResReq.resReqResWorkModel" clearable filterable placeholder="执行模式">
                      <el-option
                        v-for="workModel in taskWorkModelOptions"
                        :key="workModel.value"
                        :label="workModel.label"
                        :value="workModel.value">
                      </el-option>
                    </el-select>
                  </span>
                  <span v-else>{{ resWorkModelFormat(scope.row) }}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="100">
                <template slot-scope="scope">
                  <span class="el-tag el-tag--plain el-tag--info el-tag--mini" style="cursor: pointer;" @click="editResReq(scope.row, scope.$index, true)">
                    {{ scope.row.isSet ? '保存' : '修改' }}
                  </span>
                  <span v-if="!scope.row.isSet" class="el-tag el-tag--plain el-tag--danger el-tag--mini" style="cursor: pointer;" @click="deleteResReq(scope.row)">删除</span>
                  <span v-else class="el-tag el-tag--plain el-tag--mini" style="cursor: pointer;" @click="editResReq(scope.row, scope.$index, false)">取消</span>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="知识" name="know">知识</el-tab-pane>
        </el-tabs>
      </el-aside>
    </el-container>
  </el-container>
</template>

<script>
import Sortable from 'sortablejs'
export default {
  data() {
    return {
      activeTagName: 'human',
      taskList: [],
      taskResPlanList: [],
      currProj: {},
      currProc: {},
      currTask: {
        pmsTask: {
          taskUid: '',
          taskId: '',
          taskName: '',
          taskPlanStartDateTime: '',
          taskPlanFinishDateTime: '',
          taskPlanDur: '',
          taskEarlyStartDateTime: '',
          taskLateFinishDateTime: '',
          taskInType: 0,
          taskOutType: 0,
          taskWorkModel: 0,
          taskType: 0,
          taskPriority: 0,
          taskProcUid: '',
          taskProjUid: ''
        },
        taskNormalPreTasks: [],
        taskRealPreTasks: [],
        isSet: true
      },
      currTaskResPlan: {},
      currResReq: {},
      taskInTypeOptions: [{
        value: 0,
        label: '普通'
      }, {
        value: 1,
        label: '或输入'
      }],
      taskOutTypeOptions: [{
        value: 0,
        label: '普通'
      }, {
        value: 1,
        label: '或输出'
      }],
      taskWorkModelOptions: [{
        value: 0,
        label: '普通'
      }, {
        value: 1,
        label: '连续'
      }],
      taskTypeOptions: [{
        value: 0,
        label: '普通'
      }, {
        value: 1,
        label: '节点'
      }, {
        value: 2,
        label: '黑盒'
      }],
      taskPriorityOptions: [{
        value: 1,
        label: '普通'
      }, {
        value: 2,
        label: '重要'
      }, {
        value: 4,
        label: '关键'
      }],
      OrgTreeProps: {
        children: 'children',
        label: 'orgName'
      },
      currOrg: {},
      orgListTree: [],
      equipList: [],
      humList: [],
      placeList: [],
      resReqList: [],
      resReqHumList: [],
      resReqEquipList: [],
      resReqPlaceList: []
    }
  },
  created() {
    this.getCurrProc().then(() => {
      this.getTaskList().then(() => {
        if (this.taskList.length > 0) {
          this.currTask = JSON.parse(JSON.stringify(this.taskList[0]))
          // 刷新资源方案列表
          this.getTaskResPlanList().then(() => {
            // 当前资源方案默认为该任务第一个资源方案
            if (this.taskResPlanList.length > 0) {
              this.currTaskResPlan = this.taskResPlanList[0]
              for (let i = 0, len = this.taskResPlanList.length; i < len; i++) {
                if (this.taskResPlanList[i].resPlanId === '1') {
                  this.currTaskResPlan = this.taskResPlanList[i]
                  this.getResReqList()
                  break
                }
              }
            } else {
              this.currTaskResPlan = {}
              this.resReqList = []
            }
          })
        }
      })
      this.getCurrProj()
    })
    this.getOrgListTree()
    this.getHumList()
    this.getEquipList()
    this.getPlaceList()
  },
  watch: {
    'currTask.pmsTask.taskPlanStartDateTime'() {
      this.taskPlanStartChange()
    },
    'currTask.pmsTask.taskPlanFinishDateTime'() {
      this.taskPlanFinishChange()
    },
    'currTask.pmsTask.taskPlanDur'() {
      this.taskPlanDurChange()
    }
  },
  mounted() {
    this.rowDrop()
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    // 行拖拽
    rowDrop() {
      const tbody = document.querySelector('.el-table__body-wrapper tbody')
      Sortable.create(tbody, {
        onEnd: ({ newIndex, oldIndex }) => {
          const currRow = this.taskList.splice(oldIndex, 1)[0]
          this.taskList.splice(newIndex, 0, currRow)
        }
      })
    },
    // 表格内时间格式化
    datetimeFormat(datetime) {
      if (datetime === undefined || datetime === null) {
        return ''
      }
      const moment = require('moment')
      return moment(datetime).format('YYYY-MM-DD HH:mm')
    },
    // 格式化任务类型
    taskTypeFormat(row) {
      switch (row.pmsTask.taskType) {
        case 0: return '普通'
        case 1: return '节点'
        case 2: return '黑盒'
      }
    },
    // 格式化任务执行模式
    taskWorkModelFormat(row) {
      switch (row.pmsTask.taskWorkModel) {
        case 0: return '普通'
        case 1: return '连续'
      }
    },
    // 格式化任务输入类型
    taskInTypeFormat(row) {
      switch (row.pmsTask.taskInType) {
        case 0: return '普通'
        case 1: return '或输入'
      }
    },
    // 格式化任务输出类型
    taskOutTypeFormat(row) {
      switch (row.pmsTask.taskOutType) {
        case 0: return '普通'
        case 1: return '或输出'
      }
    },
    // 格式化任务优先级
    taskPriorityFormat(row) {
      switch (row.pmsTask.taskPriority) {
        case 1: return '普通'
        case 2: return '重要'
        case 4: return '关键'
        default: return '未知'
      }
    },
    // 格式化普通紧前任务列
    taskNormalPreTasksFormat(row) {
      const preTasks = row.taskNormalPreTasks
      const preTaskIds = []
      for (let i = 0, len = preTasks.length; i < len; i++) {
        preTaskIds.push(preTasks[i].taskId)
      }
      return preTaskIds.join(',')
    },
    // 格式化真紧前任务列
    taskRealPreTasksFormat(row) {
      const preTasks = row.taskRealPreTasks
      const preTaskIds = []
      for (let i = 0, len = preTasks.length; i < len; i++) {
        preTaskIds.push(preTasks[i].taskId)
      }
      return preTaskIds.join(',')
    },
    // 格式化场地类型列
    placeTypeFormat(row) {
      switch (row.placeType) {
        case 0: return '仓库'
        case 1: return '露天场地'
        case 2: return '会议室'
      }
    },
    // 格式化资源能力
    resAbilityTypeFormat(row) {
      switch (row.resAbilityType) {
        case '0': return '仓库'
        case '1': return '露天场地'
        case '2': return '会议室'
        default: return row.resAbilityType
      }
    },
    // 格式化资源执行模式
    resWorkModelFormat(row) {
      switch (row.resReqResWorkModel) {
        case 0: return '普通'
        case 1: return '连续'
      }
    },
    // 判断str是否为空或空字符串
    strIsEmpty(str) {
      if (str === undefined || str === null || str === '') {
        return true
      }
    },
    // 表单中任务计划时间变化时
    taskPlanStartChange() {
      const task = this.currTask.pmsTask
      if (!this.strIsEmpty(task.taskPlanStartDateTime) && !this.strIsEmpty(task.taskPlanFinishDateTime)) {
        const startDate = new Date(task.taskPlanStartDateTime)
        const start = startDate.getTime()
        const finishDate = new Date(task.taskPlanFinishDateTime)
        const finish = finishDate.getTime()
        if (task.taskWorkModel === 1) {
          task.taskPlanDur = ((finish - start) / (1000 * 3600 * 10))
          return
        }
        const hoursDiff = finishDate.getHours() - startDate.getHours()
        let dur = Math.floor((finish - start) / (1000 * 3600 * 24)) + hoursDiff / 10
        if (hoursDiff < 0) {
          dur++
        }
        task.taskPlanDur = dur
      } else if (!this.strIsEmpty(task.taskPlanStartDateTime) && !this.strIsEmpty(task.taskPlanDur)) {
        const startDate = new Date(task.taskPlanStartDateTime)
        const start = startDate.getTime()
        if (task.taskWorkModel === 1) {
          task.taskPlanFinishDateTime = new Date(start + (1000 * 3600 * 10) * task.taskPlanDur)
          return
        }
        const days = Math.floor(task.taskPlanDur)
        const hours = (task.taskPlanDur - days) * 10
        let dur = (1000 * 3600 * 24) * days + (1000 * 3600) * hours
        let finishDate = new Date(start + dur)
        if (finishDate.getHours() > 18 || finishDate.getHours() <= 4) {
          dur += 1000 * 3600 * 14
          finishDate = new Date(start + dur)
        } else if (finishDate.getHours() < 8) {
          dur += 1000 * 3600 * 28
          finishDate = new Date(start + dur)
        }
        task.taskPlanFinishDateTime = finishDate
      }
    },
    taskPlanFinishChange() {
      const task = this.currTask.pmsTask
      if (!this.strIsEmpty(task.taskPlanStartDateTime) && !this.strIsEmpty(task.taskPlanFinishDateTime)) {
        const startDate = new Date(task.taskPlanStartDateTime)
        const start = startDate.getTime()
        const finishDate = new Date(task.taskPlanFinishDateTime)
        const finish = finishDate.getTime()
        if (task.taskWorkModel === 1) {
          task.taskPlanDur = ((finish - start) / (1000 * 3600 * 10))
          return
        }
        const hoursDiff = finishDate.getHours() - startDate.getHours()
        let dur = Math.floor((finish - start) / (1000 * 3600 * 24)) + hoursDiff / 10
        if (hoursDiff < 0) {
          dur++
        }
        task.taskPlanDur = dur
      } else if (!this.strIsEmpty(task.taskPlanFinishDateTime) && !this.strIsEmpty(task.taskPlanDur)) {
        const finishDate = new Date(task.taskPlanFinishDateTime)
        const finish = finishDate.getTime()
        if (task.taskWorkModel === 1) {
          task.taskPlanStartDateTime = new Date(finish - (1000 * 3600 * 10) * task.taskPlanDur)
          return
        }
        const days = Math.floor(task.taskPlanDur)
        const hours = (task.taskPlanDur - days) * 10
        let dur = (1000 * 3600 * 24) * days + (1000 * 3600) * hours
        let startDate = new Date(finish - dur)
        if (startDate.getHours() < 8 || startDate.getHours() >= 22) {
          dur += 1000 * 3600 * 14
          startDate = new Date(finish - dur)
        } else if (startDate.getHours() > 18) {
          dur += 1000 * 3600 * 18
          startDate = new Date(finish - dur)
        }
        task.taskPlanStartDateTime = startDate
      }
    },
    taskPlanDurChange() {
      const task = this.currTask.pmsTask
      const regPos = /^\d+(\.\d+)?$/
      if (!regPos.test(task.taskPlanDur)) {
        return
      }
      if (!this.strIsEmpty(task.taskPlanStartDateTime) && !this.strIsEmpty(task.taskPlanDur)) {
        const startDate = new Date(task.taskPlanStartDateTime)
        const start = startDate.getTime()
        if (task.taskWorkModel === 1) {
          task.taskPlanFinishDateTime = new Date(start + (1000 * 3600 * 10) * task.taskPlanDur)
          return
        }
        const days = Math.floor(task.taskPlanDur)
        const hours = (task.taskPlanDur - days) * 10
        let dur = (1000 * 3600 * 24) * days + (1000 * 3600) * hours
        let finishDate = new Date(start + dur)
        if (finishDate.getHours() > 18 || finishDate.getHours() <= 4) {
          dur += 1000 * 3600 * 14
          finishDate = new Date(start + dur)
        } else if (finishDate.getHours() < 8) {
          dur += 1000 * 3600 * 28
          finishDate = new Date(start + dur)
        }
        task.taskPlanFinishDateTime = finishDate
      } else if (!this.strIsEmpty(task.taskPlanFinishDateTime) && !this.strIsEmpty(task.taskPlanDur)) {
        const finishDate = new Date(task.taskPlanFinishDateTime)
        const finish = finishDate.getTime()
        if (task.taskWorkModel === 1) {
          task.taskPlanStartDateTime = new Date(finish - (1000 * 3600 * 10) * task.taskPlanDur)
          return
        }
        const days = Math.floor(task.taskPlanDur)
        const hours = (task.taskPlanDur - days) * 10
        let dur = (1000 * 3600 * 24) * days + (1000 * 3600) * hours
        let startDate = new Date(finish - dur)
        if (startDate.getHours() < 8 || startDate.getHours() >= 22) {
          dur += 1000 * 3600 * 14
          startDate = new Date(finish - dur)
        } else if (startDate.getHours() > 18) {
          dur += 1000 * 3600 * 18
          startDate = new Date(finish - dur)
        }
        task.taskPlanFinishDateTime = startDate
      }
    },
    // 获得当前流程
    async getCurrProc() {
      const { data: res } = await this.$http.get('/proc/getByUid/' + this.$route.query.procUid)
      this.currProc = res
    },
    // 获得当前项目
    async getCurrProj() {
      const { data: res } = await this.$http.get('/proj/getByUid/' + this.currProc.procProjUid)
      this.currProj = res
    },
    // 请求任务表格数据
    async getTaskList() {
      const { data: res } = await this.$http.get('/task/getTaskListByProcUid/' + this.currProc.procUid)
      res.map(task => {
        task.isSet = false // 给后台返回数据添加`isSet`标识
        return task
      })
      this.taskList = res
    },
    // 请求资源计划表格数据
    async getTaskResPlanList() {
      const { data: res } = await this.$http.get('/taskResPlan/getByTaskUid/' + this.currTask.pmsTask.taskUid)
      res.map(resPlan => {
        resPlan.isSet = false // 给后台返回数据添加`isSet`标识
        return resPlan
      })
      this.taskResPlanList = res
    },
    // 请求组织树数据
    async getOrgListTree() {
      const { data: res } = await this.$http.get('/org/getOrgTableData')
      this.orgListTree = res
    },
    // 请求全体人员列表
    async getHumList() {
      const { data: res } = await this.$http.get('/hum/getHumList')
      this.humList = res
    },
    // 根据组织UID请求人员列表
    async getHumListByOrgUid() {
      const { data: res } = await this.$http.get('/hum/getHumListByOrgUid/' + this.currOrg.orgUid)
      this.humList = res
    },
    // 请求全部设备列表
    async getEquipList() {
      const { data: res } = await this.$http.get('/equip/getEquipList')
      this.equipList = res
    },
    // 根据组织UID请求设备列表
    async getEquipListByOrgUid() {
      const { data: res } = await this.$http.get('/equip/getEquipListByOrgUid/' + this.currOrg.orgUid)
      this.equipList = res
    },
    // 请求全部场地列表
    async getPlaceList() {
      const { data: res } = await this.$http.get('/place/getPlaceList')
      this.placeList = res
    },
    // 根据组织UID请求场地列表
    async getPlaceListByOrgUid() {
      const { data: res } = await this.$http.get('/place/getPlaceListByOrgUid/' + this.currOrg.orgUid)
      this.placeList = res
    },
    // 请求资源需求列表
    async getResReqList() {
      const { data: res } = await this.$http.get('/taskResReq/getResReqListByTaskResPlanUid/' + this.currTaskResPlan.resPlanUid)
      res.map(resReq => {
        resReq.isSet = false // 给后台返回数据添加`isSet`标识
        return resReq
      })
      this.resReqList = res
      this.resReqHumList = []
      this.resReqEquipList = []
      this.resReqPlaceList = []
      for (let i = 0, len = res.length; i < len; i++) {
        switch (res[i].resReqResType) {
          case 0:
            this.resReqHumList.push(res[i]); break
          case 1:
            this.resReqEquipList.push(res[i]); break
          case 2:
            this.resReqPlaceList.push(res[i]); break
          default: break
        }
      }
    },
    // 添加任务
    addTask() {
      for (const task of this.taskList) {
        if (task.isSet) return this.$message.warning('请先保存当前编辑项')
      }
      const tempTask = {
        pmsTask: {
          taskUid: '',
          taskId: this.taskList.length + 1 + '',
          taskName: '',
          taskPlanStartDateTime: '',
          taskPlanFinishDateTime: '',
          taskPlanDur: '',
          taskEarlyStartDateTime: '',
          taskLateFinishDateTime: '',
          taskInType: 0,
          taskOutType: 0,
          taskWorkModel: 0,
          taskType: 0,
          taskPriority: this.currProj.projPriority,
          taskProcUid: this.currProc.procUid,
          taskProjUid: this.currProc.procProjUid
        },
        taskNormalPreTasks: [],
        taskRealPreTasks: [],
        isSet: true
      }
      this.taskList.push(tempTask)
      this.currTask = tempTask
    },
    // 修改
    editTask(row, index, cg) {
      // 点击修改，判断是否已经保存所有操作
      for (const task of this.taskList) {
        if (task.isSet && task.pmsTask.taskUid !== row.pmsTask.taskUid) {
          this.$message.warning('请先保存当前编辑项')
          return false
        }
      }
      // 是否取消操作
      if (!cg) {
        if (this.currTask.pmsTask.taskUid.length === 0) {
          this.taskList.splice(index, 1)
        }
        return (row.isSet = !row.isSet)
      }
      // 提交数据
      if (row.isSet) {
        this.$http.post('/task/saveOrUpdateTask', this.currTask).then(() => {
          // 刷新任务列表数据
          this.getTaskList().then(() => {
            // 刷新资源方案列表
            if (this.currTask.pmsTask.taskUid.length === 0) {
              // 如果是添加任务
              this.currTask = this.taskList[this.taskList.length - 1]
              this.taskResPlanList = []
            } else {
              // 如果是编辑任务
              this.getTaskResPlanList()
            }
          })
          this.$message.success('保存成功！')
        })
      } else {
        this.currTask = JSON.parse(JSON.stringify(row))
        // 刷新资源方案列表
        this.getTaskResPlanList().then(() => {
          // 当前资源方案默认为该任务第一个资源方案
          if (this.taskResPlanList.length > 0) {
            this.currTaskResPlan = this.taskResPlanList[0]
            for (let i = 0, len = this.taskResPlanList.length; i < len; i++) {
              if (this.taskResPlanList[i].resPlanId === '1') {
                this.currTaskResPlan = this.taskResPlanList[i]
                this.getResReqList()
                break
              }
            }
          } else {
            this.currTaskResPlan = {}
            this.resReqList = []
            this.resReqHumList = []
            this.resReqEquipList = []
            this.resReqPlaceList = []
          }
        })
        row.isSet = true
      }
    },
    // 删除任务
    deleteTask(row) {
      this.$http.delete('/task/deleteByUid/' + row.pmsTask.taskUid).then(() => {
        // 刷新任务列表数据
        this.getTaskList()
        // 如果删除的是currTask所指的一行，则资源列表置空
        if (this.currTask.pmsTask.taskUid === row.pmsTask.taskUid) {
          this.taskResPlanList = []
          this.currTaskResPlan = {}
          this.resReqList = []
          this.resReqHumList = []
          this.resReqEquipList = []
          this.resReqPlaceList = []
        }
        this.$message.success('删除成功！')
      })
    },
    // 更新任务编号
    updatePmsTaskIds() {
      const pmsTasks = []
      const tasks = this.taskList
      for (let i = 0, len = tasks.length; i < len; i++) {
        const pmsTask = tasks[i].pmsTask
        pmsTask.taskId = i + 1
        pmsTasks.push(pmsTask)
      }
      this.$http.put('/task/updatePmsTaskIds', pmsTasks).then(() => {
        // 刷新任务表格数据
        this.taskList = [] // 加这句才没问题
        this.getTaskList()
        this.$message.success('更新成功！')
      })
    },
    // 点击资源按钮
    resPlan(row) {
      this.currTask = row
      this.getTaskResPlanList().then(() => {
        // 当前资源方案默认为该任务第一个资源方案
        if (this.taskResPlanList.length > 0) {
          this.currTaskResPlan = this.taskResPlanList[0]
          for (let i = 0, len = this.taskResPlanList.length; i < len; i++) {
            if (this.taskResPlanList[i].resPlanId === '1') {
              this.currTaskResPlan = this.taskResPlanList[i]
              this.getResReqList()
              break
            }
          }
        } else {
          this.currTaskResPlan = {}
          this.resReqList = []
          this.resReqHumList = []
          this.resReqEquipList = []
          this.resReqPlaceList = []
        }
      })
    },
    // 添加任务资源方案
    addTaskResPlan() {
      for (const resPlan of this.taskResPlanList) {
        if (resPlan.isSet) return this.$message.warning('请先保存当前编辑项')
      }
      const tempResPlan = {
        resPlanUid: '',
        resPlanId: this.taskResPlanList.length + 1 + '',
        resPlanTaskUid: this.currTask.pmsTask.taskUid,
        resPlanProcUid: this.currTask.pmsTask.taskProcUid,
        resPlanProjUid: this.currTask.pmsTask.taskProjUid,
        resPlanPriority: this.taskResPlanList.length + 1 + '',
        isSet: true
      }
      this.taskResPlanList.push(tempResPlan)
      this.currTaskResPlan = tempResPlan
    },
    // 修改任务资源方案
    editTaskResPlan(row, index, cg) {
      // 点击修改，判断是否已经保存所有操作
      for (const resPlan of this.taskResPlanList) {
        if (resPlan.isSet && resPlan.resPlanUid !== row.resPlanUid) {
          this.$message.warning('请先保存当前编辑项')
          return false
        }
      }
      // 是否取消操作
      if (!cg) {
        if (this.currTaskResPlan.resPlanUid.length === 0) {
          this.taskResPlanList.splice(index, 1)
        }
        return (row.isSet = !row.isSet)
      }
      // 保存
      if (row.isSet) {
        this.$http.post('/taskResPlan/saveOrUpdate', this.currTaskResPlan).then(() => {
          // 刷新任务资源列表数据
          this.getTaskResPlanList().then(() => {
            for (let i = 0, len = this.taskResPlanList.length; i < len; i++) {
              if (this.currTaskResPlan.resPlanId === this.taskResPlanList[i].resPlanId) {
                this.currTaskResPlan = this.taskResPlanList[i]
                break
              }
            }
          })
          this.$message.success('保存成功！')
        })
      } else {
        this.currTaskResPlan = JSON.parse(JSON.stringify(row))
        // 刷新资源需求列表数据
        this.getResReqList()
        row.isSet = true
      }
    },
    // 删除任务资源方案
    deleteTaskResPlan(row) {
      this.$http.delete('/taskResPlan/deleteByUid/' + row.resPlanUid).then(() => {
        // 刷新任务列表数据
        this.getTaskResPlanList()
        this.$message.success('删除成功！')
      })
    },
    // 点击资源方案编制按钮
    devTaskResPlan(row) {
      this.currTaskResPlan = row
      this.getResReqList()
    },
    // 添加资源需求
    addResReq(row) {
      for (const resreq of this.resReqList) {
        if (resreq.isSet) return this.$message.warning('请先保存当前编辑项')
      }
      const tempResReq = {
        resReqUid: '',
        resReqId: '',
        resReqResPlanUid: this.currTaskResPlan.resPlanUid,
        resReqTaskUid: this.currTaskResPlan.resPlanTaskUid,
        resReqProcUid: this.currTaskResPlan.resPlanProcUid,
        resReqProjUid: this.currTaskResPlan.resPlanProjUid,
        resReqResType: '',
        resReqResUid: '',
        resId: '',
        resName: '',
        resAbilityType: '',
        resReqResStartDateTime: '',
        resReqResFinishDateTime: '',
        resReqResWork: '',
        resReqResWorkModel: 0,
        isSet: true
      }
      switch (this.activeTagName) {
        case 'human':
          tempResReq.resReqResType = 0
          tempResReq.resReqResUid = row.humUid
          tempResReq.resId = row.humId
          tempResReq.resName = row.humName
          tempResReq.resAbilityType = row.humAbilityType
          this.resReqHumList.push(tempResReq)
          break
        case 'equip':
          tempResReq.resReqResType = 1
          tempResReq.resReqResUid = row.equipUid
          tempResReq.resId = row.equipId
          tempResReq.resName = row.equipName
          tempResReq.resAbilityType = row.equipCapType
          this.resReqEquipList.push(tempResReq)
          break
        case 'place':
          tempResReq.resReqResType = 2
          tempResReq.resReqResUid = row.placeUid
          tempResReq.resId = row.placeId
          tempResReq.resName = row.placeName
          tempResReq.resAbilityType = row.placeType
          this.resReqPlaceList.push(tempResReq)
          break
        default: console.log('未知类型')
      }
      this.currResReq = tempResReq
    },
    // 修改资源需求
    editResReq(row, index, cg) {
      // 点击修改，判断是否已经保存所有操作
      for (const resreq of this.resReqList) {
        if (resreq.isSet && resreq.resReqUid !== row.resReqUid) {
          this.$message.warning('请先保存当前编辑项')
          return false
        }
      }
      // 是否取消操作
      if (!cg) {
        if (this.currResReq.resReqUid.length === 0) {
          switch (this.currResReq.resReqResType) {
            case 0 :
              this.resReqHumList.splice(index, 1)
              break
            case 1 :
              this.resReqEquipList.splice(index, 1)
              break
            case 2 :
              this.resReqPlaceList.splice(index, 1)
              break
          }
        }
        return (row.isSet = !row.isSet)
      }
      // 保存
      if (row.isSet) {
        this.$http.post('/taskResReq/saveOrUpdate', this.currResReq).then(() => {
          // 刷新资源需求列表数据
          this.getResReqList()
          this.$message.success('保存成功！')
        })
      } else {
        this.currResReq = JSON.parse(JSON.stringify(row))
        row.isSet = true
      }
    },
    // 删除资源需求
    deleteResReq(row) {
      this.$http.delete('/taskResReq/deleteByUid/' + row.resReqUid).then(() => {
        // 刷新资源需求列表数据
        this.getResReqList()
        this.$message.success('删除成功！')
      })
    },
    // 查看全部按钮
    getAllEquipClick() {
      this.getHumList()
      this.getEquipList()
      this.getPlaceList()
      // 清空当前选中组织
      this.currOrg = {}
    },
    // 选择组织
    OrgTreeNodeClick(org) {
      this.currOrg = org
      // 更新资源表格信息
      this.getHumListByOrgUid()
      this.getEquipListByOrgUid()
      this.getPlaceListByOrgUid()
    }
  }
}
</script>

<style lang="less" scoped>
  .el-main {
    padding: 0;
    height: 100%;
  }
  .up-container {
    height: 50%;
  }
  .down-container {
    height: 50%;
  }
  .el-table-up-head {
    margin: 0;
    width: 100%;
    height: 46px;
    /*border: 1px dashed #c1c1cd;*/
    /*border-radius: 3px;*/
    /*cursor: pointer;*/
    justify-content: center;
    display: flex;
    line-height: 46px
  }
  .down-middle-aside {
    background: #ded;
    .el-card {
      padding: 0;
      height: 45px;
      background: #ddd;
      color: #909399;
      font: 14px"Microsoft YaHei";
      font-weight: bold;
      text-align: center;
      vertical-align: middle;
    }
    .el-tree {
      height: 350px;
      background: #ded;
    }
    market_out.el-tabs__header {
      margin: 0;
    }
    .el-tabs /deep/ .el-tabs__header {
      margin: 0;
    }
  }
</style>
