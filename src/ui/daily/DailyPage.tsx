import React from 'react'
import clsx from 'clsx'
import {Badge, Box, Container, createStyles, Grid, IconButton, Paper} from '@material-ui/core'
import NotificationsIcon from '@material-ui/icons/Notifications'
import {makeStyles} from '@material-ui/core/styles'
import {useSelector} from "react-redux";
import {RootState} from "../../store/rootReducer";
import DaySummary from "./DaySummary";
import PlannerEventList from "../plannerEvents/PlannerEventList";
import DrawerLayout from "../../app/DrawerLayout";

const useStyles = makeStyles((theme) => createStyles({
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
}));

export default function DailyPage() {
  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  const todayDate = useSelector<RootState, string>(state => state.daily.todayDate)

  const actions = (
    <IconButton color="inherit">
      <Badge badgeContent={4} color="secondary">
        <NotificationsIcon />
      </Badge>
    </IconButton>
  )

  return (
    <DrawerLayout title="Dashboard" actions={actions}>
      <Container maxWidth="lg" className={classes.container}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Paper className={fixedHeightPaper}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={9}>
                  <DaySummary date={todayDate} />
                </Grid>
                <Grid item xs={12} md={3}>
                  {"water glasses"}
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid item md={6} xs={12}>
            <Paper className={classes.paper}>
              <Box>habits</Box>
            </Paper>
          </Grid>
          <Grid item md={6} xs={12}>
            <Paper className={classes.paper}>
              <PlannerEventList date={todayDate} />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </DrawerLayout>
  )
}
