import React, { useContext } from 'react'
import { useQuery, useMutation } from "@apollo/client"
import { gql } from "@apollo/client"
import { v4 } from "uuid"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Link } from 'react-router-dom'

import {
  Badge,
  Button,
  Dropdown,
  Icon,
  Card,
  Grid,
} from "tabler-react";

import AppSettingsContext from '../../context/AppSettingsContext'
import HasPermissionWrapper from "../../HasPermissionWrapper"
import { confirmAlert } from 'react-confirm-alert'
import { toast } from 'react-toastify'

import CSLS from "../../../tools/cs_local_storage"

import { capitalize } from '../../../tools/string_tools'
import BadgePublic from '../../ui/BadgePublic'
import ScheduleClassesBase from './ScheduleClassesBase'

import { GET_CLASSES_QUERY } from "./queries"
import { 
  get_class_messages,
  get_list_query_variables, 
  represent_class_status,
  represent_instructor 
} from './tools'

import moment from 'moment'


const DELETE_SCHEDULE_CLASS = gql`
  mutation DeleteScheduleClass($input: DeleteScheduleClassInput!) {
    deleteScheduleClass(input: $input) {
      ok
    }
  }
`


const confirm_delete = ({t, msgConfirm, msgDescription, msgSuccess, deleteFunction, functionVariables}) => {
  confirmAlert({
    customUI: ({ onClose }) => {
      return (
        <div key={v4()} className='custom-ui'>
          <h1>{t('general.confirm_delete')}</h1>
          {msgConfirm}
          {msgDescription}
          <button className="btn btn-link pull-right" onClick={onClose}>{t('general.confirm_delete_no')}</button>
          <button
            className="btn btn-danger"
            onClick={() => {
              deleteFunction(functionVariables)
                .then(({ data }) => {
                  console.log('got data', data);
                  toast.success(
                    msgSuccess, {
                      position: toast.POSITION.BOTTOM_RIGHT
                    })
                }).catch((error) => {
                  toast.error((t('general.toast_server_error')) +  error, {
                      position: toast.POSITION.BOTTOM_RIGHT
                    })
                  console.log('there was an error sending the query', error);
                })
              onClose()
            }}
          >
            <Icon name="trash-2" /> {t('general.confirm_delete_yes')}
          </button>
        </div>
      )
    }
  })
}


// Set some initial values for dates, if not found
if (!localStorage.getItem(CSLS.SCHEDULE_CLASSES_DATE_FROM)) {
  console.log('date from not found... defaulting to today...')
  localStorage.setItem(CSLS.SCHEDULE_CLASSES_DATE_FROM, moment().format('YYYY-MM-DD')) 
  localStorage.setItem(CSLS.SCHEDULE_CLASSES_DATE_UNTIL, moment().add(6, 'days').format('YYYY-MM-DD')) 
} 


function ScheduleClasses ({ t, history }) {
  const appSettings = useContext(AppSettingsContext)
  const timeFormat = appSettings.timeFormatMoment

  const {loading, error, data, refetch} = useQuery(GET_CLASSES_QUERY, {
    variables: get_list_query_variables(),
    fetchPolicy: "network-only"
  })
  const [deleteScheduleClass] = useMutation(DELETE_SCHEDULE_CLASS)

  if (loading) {
    return (
      <ScheduleClassesBase>
        <p>{t('general.loading_with_dots')}</p>
      </ScheduleClassesBase>
    )
  }

  if (error) {
    return (
      <ScheduleClassesBase>
        <p>{t('general.error_sad_smiley')}</p>
      </ScheduleClassesBase>
    )
  }

  const classes = data.scheduleClasses
       
  // Empty list
  if (!classes.length) { return (
    <ScheduleClassesBase>
      <p>
        {t('schedule.classes.empty_list')}
      </p>
    </ScheduleClassesBase>
  )} 

  return (
    <ScheduleClassesBase data={data} refetch={refetch}>
      { data.scheduleClasses.map(({ date, classes }) => (
        <React.Fragment key={v4()}>
          <h3>
            {capitalize(moment(date).format("dddd"))} {' '}
            <small className="text-muted">
                  {moment(date).format("LL")} 
            </small>
          </h3>
          {!(classes.length) ? <Card>
              <Card.Body>
                <h5>{t('schedule.classes.empty_list')} <i className="fa fa-beach"/></h5>
              </Card.Body>
            </Card> 
          :
            classes.map((
              { scheduleItemId, 
                frequencyType,
                date, 
                status,
                holiday,
                holidayName,
                description,
                account, 
                role,
                account2,
                role2,
                organizationLocationRoom, 
                organizationClasstype, 
                organizationLevel,
                timeStart, 
                timeEnd,
                spaces,
                countAttendance,
                displayPublic }) => (
                  <Card key={v4()}>
                    <Card.Body>
                      <Grid.Row>
                        <Grid.Col xs={9} sm={9} md={10}>
                          <Grid.Row>
                            <Grid.Col xs={12}>
                              <h5>
                                {represent_class_status(status)}
                                <span className='mr-2'>
                                {/* Class type */}
                                {organizationClasstype.name} { ' ' }
                                {/* Start & end time */}
                                {moment(date + ' ' + timeStart).format(timeFormat)} {' - '}
                                {moment(date + ' ' + timeEnd).format(timeFormat)} { ' ' }
                                </span>
                                {organizationLevel && <small className="text-muted">
                                  {organizationLevel.name}
                                </small>}
                              </h5>
                            </Grid.Col>
                          </Grid.Row>
                          <Grid.Row>
                            <Grid.Col xs={12}>
                              {/* Instructor(s) */}
                              { (account) ? 
                                  represent_instructor(account.fullName, role) : 
                                  <span className="text-red">{t("schedule.classes.no_instructor")}</span>
                              } <br />
                              <small className="text-muted">
                                {(account2) ? represent_instructor(account2.fullName, role2) : ""}
                              </small>
                            </Grid.Col>
                            <Grid.Col xs={12}>
                              {/* Location */}
                              <Icon name="home" /> {organizationLocationRoom.organizationLocation.name} 
                              <small className="text-muted"> | {organizationLocationRoom.name}</small>
                            </Grid.Col>
                          </Grid.Row>
                        </Grid.Col>
                        <Grid.Col xs={3} sm={3} md={2}>
                          <Dropdown
                            key={v4()}
                            className="float-right"
                            type="link"
                            position="left"
                            toggle={false}
                            // color="secondary"
                            // triggerClassName="btn btn-pill btn-outline-primary btn-sm "
                            triggerContent={                                
                              <Button 
                                outline
                                color="primary"
                                size="sm"
                              > 
                                <span className="d-xs-none">{t("general.manage")}</span>
                                <span className="d-sm-none d-md-none d-lg-none d-xl-none"><Icon name="more-vertical" /></span>
                              </Button>
                            }
                            items={[
                              <HasPermissionWrapper key={v4()} permission="view" resource="scheduleitemattendance">
                                <Link to={'/schedule/classes/class/attendance/' + scheduleItemId + '/' + date}>
                                  <Dropdown.Item
                                    key={v4()}
                                    icon="check-circle"
                                  >
                                      {t("general.attendance")}
                                  </Dropdown.Item>
                                </Link>
                              </HasPermissionWrapper>,
                              <HasPermissionWrapper key={v4()} permission="view" resource="scheduleitemattendance">
                                <Link to={'/schedule/classes/class/attendance_chart/' + scheduleItemId + '/' + date}>
                                  <Dropdown.Item
                                    key={v4()}
                                    icon="bar-chart-2">
                                      {t("schedule.classes.class.attendance_chart.title")}
                                  </Dropdown.Item>
                                </Link>
                              </HasPermissionWrapper>,
                              <HasPermissionWrapper key={v4()} permission="view" resource="scheduleitemweeklyotc">
                                <Link to={'/schedule/classes/class/edit/' + scheduleItemId + '/' + date}>
                                  <Dropdown.Item
                                    key={v4()}
                                    icon="edit-3"
                                  >
                                    {t("general.edit")}
                                  </Dropdown.Item>
                                </Link>
                              </HasPermissionWrapper>,
                              <HasPermissionWrapper key={v4()} permission="change" resource="scheduleclass">
                                <Dropdown.ItemDivider key={v4()} />
                                <Link to={'/schedule/classes/all/edit/' + scheduleItemId}>
                                  <Dropdown.Item
                                    key={v4()}
                                    badge={t('schedule.classes.all_classes_in_series')}
                                    badgeType="secondary"
                                    icon="edit-3"
                                  >
                                      {t("general.edit")}
                                  </Dropdown.Item>
                                </Link>
                              </HasPermissionWrapper>,
                              <HasPermissionWrapper key={v4()} permission="delete" resource="scheduleclass">
                                <Dropdown.ItemDivider key={v4()} />
                                <span className="text-red">
                                <Dropdown.Item
                                  key={v4()}
                                  badge={t('schedule.classes.all_classes_in_series')}
                                  badgeType="danger"
                                  icon="trash-2"
                                  onClick={() => {
                                    confirm_delete({
                                      t: t,
                                      msgConfirm: t("schedule.classes.delete_confirm_msg"),
                                      msgDescription: <p key={v4()}>
                                        {moment(date + ' ' + timeStart).format('LT')} {' - '}
                                        {moment(date + ' ' + timeEnd).format('LT')} {' '} @ {' '}
                                        {organizationLocationRoom.organizationLocation.name} {' '}
                                        {organizationLocationRoom.name}
                                        {organizationClasstype.Name}
                                        </p>,
                                      msgSuccess: t('schedule.classes.deleted'),
                                      deleteFunction: deleteScheduleClass,
                                      functionVariables: { variables: {
                                        input: {
                                          id: scheduleItemId
                                        }
                                      }, refetchQueries: [
                                        { query: GET_CLASSES_QUERY, variables: get_list_query_variables() }
                                      ]}
                                    })
                                  }}>
                                {t("general.delete")}
                                </Dropdown.Item>
                                </span>
                              </HasPermissionWrapper>
                            ]}
                            />
                        </Grid.Col>
                      </Grid.Row>
                      <Grid.Row>
                        <Grid.Col xs={9} sm={9} md={10}>
                          <div className="mt-1">
                            <BadgePublic className="mr-2" isPublic={displayPublic} />
                            {(frequencyType === 'SPECIFIC') ? 
                              <Badge color="primary" className="mr-2">{t('general.once')}</Badge> : 
                              null } 
                            {(frequencyType === 'LAST_WEEKDAY_OF_MONTH') ? 
                              <Badge color="success" className="mr-2">{t('general.monthly')}</Badge> : 
                              null } 
                            {(status === "CANCELLED") ? 
                              <Badge color="warning" className="mr-2">{t('general.cancelled')}</Badge> : 
                              null } 
                              <small className="text-muted"><br />{get_class_messages(t, status, description, holiday, holidayName)}</small>
                          </div>
                        </Grid.Col>
                        <Grid.Col xs={3} sm={3} md={2}>
                          {/* Attendance */}
                          <small className='float-right mt-1'><Icon name="users" /> {countAttendance}/{spaces}</small>
                        </Grid.Col>
                      </Grid.Row>
                    </Card.Body>
                  </Card>
                )
            )}
        </React.Fragment >
      ))}
    </ScheduleClassesBase>
  )
}

export default withTranslation()(withRouter(ScheduleClasses))

//     <SiteWrapper>
//       <div className="my-3 my-md-5">
//         <Query query={GET_CLASSES_QUERY} variables={get_list_query_variables()}>
//           {({ loading, error, data, refetch }) => {
//             // Loading
//             if (loading) return (
//               <Container>
//                 <p>{t('general.loading_with_dots')}</p>
//               </Container>
//             )
//             // Error
//             if (error) {
//               console.log(error)
//               return (
//                 <Container>
//                   <p>{t('general.error_sad_smiley')}</p>
//                 </Container>
//               )
//             }
//             const headerOptions = <Card.Options>
//               {/* <Button color={(!archived) ? 'primary': 'secondary'}  
//                       size="sm"
//                       onClick={() => {archived=false; refetch({archived});}}>
//                 {t('general.current')}
//               </Button>
//               <Button color={(archived) ? 'primary': 'secondary'} 
//                       size="sm" 
//                       className="ml-2" 
//                       onClick={() => {archived=true; refetch({archived});}}>
//                 {t('general.archive')}
//               </Button> */}
//             </Card.Options>
            
//             // Empty list
//             if (!data.scheduleClasses.length) { return (
//               <ContentCard cardTitle={t('schedule.classes.title')}
//                             headerContent={headerOptions}
//                             hasCardBody={true}>
//                 <p>
//                   {t('schedule.classes.empty_list')}
//                 </p>
//               </ContentCard>
//             )} else {   

//             console.log(data)
//             // Life's good! :)
//             return (
//               <Container>
//                 <Page.Header title={t("schedule.title")}>
//                   <div className="page-options d-flex">
//                     <span title={t("schedule.classes.tooltip_sort_by_location")}>
//                       <Button 
//                         icon="home"
//                         tooltip="text"
//                         className="mr-2"
//                         color={
//                           ((localStorage.getItem(CSLS.SCHEDULE_CLASSES_ORDER_BY) === "location") || (!localStorage.getItem(CSLS.SCHEDULE_CLASSES_ORDER_BY))) ?
//                           "azure" : "secondary"
//                         }
//                         onClick={() => {
//                           localStorage.setItem(CSLS.SCHEDULE_CLASSES_ORDER_BY, "location")
//                           refetch(get_list_query_variables())
//                         }}
//                       />
//                     </span>
//                     <span title={t("schedule.classes.tooltip_sort_by_starttime")}>
//                       <Button 
//                         icon="clock"
//                         className="mr-2"
//                         color={
//                           (localStorage.getItem(CSLS.SCHEDULE_CLASSES_ORDER_BY) === "starttime") ?
//                           "azure" : "secondary"
//                         }
//                         onClick={() => {
//                           localStorage.setItem(CSLS.SCHEDULE_CLASSES_ORDER_BY, "starttime")
//                           refetch(get_list_query_variables())
//                         }}
//                       />
//                     </span>
//                     <CSDatePicker 
//                       className="form-control schedule-list-csdatepicker mr-2"
//                       selected={new Date(localStorage.getItem(CSLS.SCHEDULE_CLASSES_DATE_FROM))}
//                       isClearable={false}
//                       onChange={(date) => {
//                         let nextWeekFrom = moment(date)
//                         let nextWeekUntil = moment(nextWeekFrom).add(6, 'days')

//                         localStorage.setItem(CSLS.SCHEDULE_CLASSES_DATE_FROM, nextWeekFrom.format('YYYY-MM-DD')) 
//                         localStorage.setItem(CSLS.SCHEDULE_CLASSES_DATE_UNTIL, nextWeekUntil.format('YYYY-MM-DD')) 

//                         console.log(get_list_query_variables())

//                         refetch(get_list_query_variables())
//                       }}
//                       placeholderText={t('schedule.classes.go_to_date')}
//                     />
//                     <Button.List className="schedule-list-page-options-btn-list">
//                       <Button 
//                         icon="chevron-left"
//                         color="secondary"
//                         onClick={ () => {
//                           let nextWeekFrom = moment(localStorage.getItem(CSLS.SCHEDULE_CLASSES_DATE_FROM)).subtract(7, 'days')
//                           let nextWeekUntil = moment(nextWeekFrom).add(6, 'days')
                          
//                           localStorage.setItem(CSLS.SCHEDULE_CLASSES_DATE_FROM, nextWeekFrom.format('YYYY-MM-DD')) 
//                           localStorage.setItem(CSLS.SCHEDULE_CLASSES_DATE_UNTIL, nextWeekUntil.format('YYYY-MM-DD')) 

//                           refetch(get_list_query_variables())
//                       }} />
//                       <Button 
//                         icon="sunset"
//                         color="secondary"
//                         onClick={ () => {
//                           let currentWeekFrom = moment()
//                           let currentWeekUntil = moment(currentWeekFrom).add(6, 'days')

//                           localStorage.setItem(CSLS.SCHEDULE_CLASSES_DATE_FROM, currentWeekFrom.format('YYYY-MM-DD')) 
//                           localStorage.setItem(CSLS.SCHEDULE_CLASSES_DATE_UNTIL, currentWeekUntil.format('YYYY-MM-DD')) 
                          
//                           refetch(get_list_query_variables())
//                       }} />
//                       <Button 
//                         icon="chevron-right"
//                         color="secondary"
//                         onClick={ () => {
//                           let nextWeekFrom = moment(localStorage.getItem(CSLS.SCHEDULE_CLASSES_DATE_FROM)).add(7, 'days')
//                           let nextWeekUntil = moment(nextWeekFrom).add(6, 'days')
                          
//                           localStorage.setItem(CSLS.SCHEDULE_CLASSES_DATE_FROM, nextWeekFrom.format('YYYY-MM-DD')) 
//                           localStorage.setItem(CSLS.SCHEDULE_CLASSES_DATE_UNTIL, nextWeekUntil.format('YYYY-MM-DD')) 

//                           refetch(get_list_query_variables())
//                       }} />
//                     </Button.List> 
//                   </div>
//                 </Page.Header>
//                 <Grid.Row>
//                   <Grid.Col md={9}>
//                     {
                      
//                       ))}
//                 </Grid.Col>
//                 <Grid.Col md={3}>
//                   <HasPermissionWrapper permission="add"
//                                         resource="scheduleclass">
//                     <Button color="primary btn-block mb-1"
//                             onClick={() => history.push("/schedule/classes/add")}>
//                       <Icon prefix="fe" name="plus-circle" /> {t('schedule.classes.add')}
//                     </Button>
//                   </HasPermissionWrapper>
//                   <div>
//                     <Button
//                       className="pull-right"
//                       color="link"
//                       size="sm"
//                       onClick={() => {
//                         localStorage.setItem(CSLS.SCHEDULE_CLASSES_FILTER_CLASSTYPE, "")
//                         localStorage.setItem(CSLS.SCHEDULE_CLASSES_FILTER_LEVEL, "")
//                         localStorage.setItem(CSLS.SCHEDULE_CLASSES_FILTER_LOCATION, "")
//                         refetch(get_list_query_variables())
//                       }}
//                     >
//                       {t("general.clear")}
//                     </Button>
//                   </div>
//                   <h5 className="mt-2 pt-1">{t("general.filter")}</h5>
//                   <ScheduleClassesFilter data={data} refetch={refetch} />
//               </Grid.Col>
//             </Grid.Row>
//           </Container>
//         )}}}
//         </Query>
//       </div>
//     </SiteWrapper>
//   )
// }
