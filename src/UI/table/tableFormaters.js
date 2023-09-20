// import { NavLink } from 'react-router-dom'
// import React from 'react'
// import { DataTypeProvider
// } from '@devexpress/dx-react-grid'
//
// import ErrorOutline from '@material-ui/icons/ErrorOutline'
// import Typography from '@material-ui/core/Typography'
//
// const TitleLink = ({ value }) => {
//   const link = value.substring(0, value.indexOf('##'))
//   const name = value.substring(value.indexOf('##') + 2)
//   return <div style={{backgroundColor: 'red'}}><NavLink style={{
//     textDecoration: 'none',
//     fontSize: 14
//
//   }} to={link}>{name}</NavLink></div>
// }
//
// const TitleFormat= ({ value }) => <Typography align='left' variant='h6'>{value}</Typography>
//
// const Status = ({ value }) => <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start'}}>
//   <ErrorOutline />
//   <div style={{marginRight: 5, marginLeft: 5}}>
//     <Typography align='left' variant='h6' color='textPrimary'>
//       {value}
//     </Typography>
//   </div>
// </div>
//
// const PrecentFormater = ({ value }) => {
//   if (value === '-') {
//     return value
//   }
//   if (value === 0) {
//     return <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start'}}>
//       <div style={{marginRight: 5, marginLeft: 5}}>
//         <div style={{fontSize: 14}}>
//           {value}%
//         </div>
//       </div>
//     </div>
//   }
//   if (!value) {
//     return '-'
//   }
//   if (value > 0) {
//     return <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start'}}>
//       <div style={{marginRight: 5, marginLeft: 5}}>
//         <div style={{fontSize: 14, color: '#4AA24E'}}>
//           {value.toFixed(2)}%
//         </div>
//       </div>
//     </div>
//   }
//   return <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start'}}>
//     <div style={{marginRight: 5, marginLeft: 5}}>
//       <div style={{fontSize: 14, color: '#DF3D2D'}}>
//         {value.toFixed(2)}%
//       </div>
//     </div>
//   </div>
// }
//
// class TitleProvider extends React.PureComponent {
//
//
// }
// export const TitleProvider = props => (
//   <DataTypeProvider
//     formatterComponent={TitleFormat}
//     {...props}
//   />
// )
// export const LinkTitleProvider = props => (
//   <DataTypeProvider
//     formatterComponent={TitleLink}
//     {...props}
//   />
// )
// export const ProjectStatusProvider = props => (
//   <DataTypeProvider
//     formatterComponent={Status}
//     {...props}
//   />
// )
//
// export const PercentProvider = props => (
//   <DataTypeProvider
//     formatterComponent={PrecentFormater}
//     {...props}
//   />
// )
