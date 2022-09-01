import moment from 'moment'
import { Icon } from 'tabler-react'

const Wrap = {
	display: 'flex',
	flexDirection: 'column',
	width: '100%'
}

const Item = {
	display: 'flex',
	flexDirection: 'row',
	alignItems: 'center',
	margin: '0 0 10px'
}

const Heading = {
	margin: '0 0 0 10px'
}

function ShopClassBookTitle({ t, class_date, timeStart, timeEnd, classType, location }) {

	const date = moment(class_date).format('MMMM Do YYYY')
	const time = timeStart + ' - ' + timeEnd 

	return(
		<div style={Wrap}>
			
			<div style={Item}>
				<Icon prefix="fe" name="calendar" />
				<h3 style={Heading}>{ date }</h3>
			</div>

			<div style={Item}>
				<Icon prefix="fe" name="clock" />
				<h4 style={Heading}>{ time } <strong>{ classType }</strong></h4>
			</div>

			<div style={Item}>
				<Icon prefix="fe" name="map-pin" />
				<h5 style={Heading}><em style={{ color: '#777'}}>{ t("general.at") }  { location }</em></h5>
			</div>

		</div>
	)

}

export default ShopClassBookTitle