import { gql } from "@apollo/client"


export const GET_SCHEDULE_SHIFT_WEEKLY_OTCS_QUERY = gql`
  query ScheduleShiftWeeklyOTCs($scheduleItem: ID!, $date: Date!) {
    scheduleItemWeeklyOtcs(first:1, scheduleItem: $scheduleItem, date:$date) {
      edges {
        node {
          id 
          date
          status
          description
          account {
            id
            fullName
          }
          role
          account2 {
            id
            fullName
          }
          role2
          organizationLocationRoom {
            id
            name
          }
          organizationShift {
            id
            name
          }
          timeStart
          timeEnd
        }
      }
    }
    scheduleItem(id:$scheduleItem) {
      id
      frequencyType
      frequencyInterval
      organizationLocationRoom {
        id
        name
        organizationLocation {
          id
          name
        }
      }
      organizationShift {
        id
        name
      }
      dateStart
      dateEnd
      timeStart
      timeEnd
    }
    accounts(first: 100, isActive: true, instructor: true) {
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
      edges {
        node {
          id
          fullName
        }
      }
    }
    organizationLocationRooms(first: 100, archived: false) {
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
      edges {
        node {
          id
          archived
          name
          organizationLocation {
            id
            name
          }
        }
      }
    }
    organizationShifts(first: 100, archived: false) {
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
      edges {
        node {
          id
          archived
          name
        }
      }
    }
  }
`

export const DELETE_SCHEDULE_ITEM_WEEKLY_OTC = gql`
  mutation DeleteScheduleItemWeeklyOTC($input: DeleteScheduleItemWeeklyOTCInput!) {
    deleteScheduleItemWeeklyOtc(input: $input) {
      ok
    }
  }
`


export const UPDATE_SCHEDULE_ITEM_WEEKLY_OTC = gql`
  mutation UpdateScheduleItemWeeklyOTC($input: UpdateScheduleItemWeeklyOTCInput!) {
    updateScheduleItemWeeklyOtc(input:$input) {
      scheduleItemWeeklyOtc {
        id
      }
    }
  }
`
