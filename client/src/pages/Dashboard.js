import React, { useEffect, useState } from 'react'
import jwt from 'jsonwebtoken'
import { useHistory } from 'react-router-dom'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import CssBaseline from '@mui/material/CssBaseline';
import Copyright from './Copyright'


const steps = ['Make FrontEnd', 'MakeBackend', 'Make tests'];


const Dashboard = () => {
	const history = useHistory()
	const [quote, setQuote] = useState('')
	const [tempQuote, setTempQuote] = useState('')
	const [activeStep, setActiveStep] = React.useState(0);
  	const [skipped, setSkipped] = React.useState(new Set());



	  const isStepOptional = (step) => {
		return step === 1;
	  };
	
	  const isStepSkipped = (step) => {
		return skipped.has(step);
	  };
	
	  const handleNext = () => {
		let newSkipped = skipped;
		if (isStepSkipped(activeStep)) {
		  newSkipped = new Set(newSkipped.values());
		  newSkipped.delete(activeStep);
		}
	
		setActiveStep((prevActiveStep) => prevActiveStep + 1);
		setSkipped(newSkipped);
	  };
	
	  const handleBack = () => {
		setActiveStep((prevActiveStep) => prevActiveStep - 1);
	  };
	
	  const handleSkip = () => {
		if (!isStepOptional(activeStep)) {
		  throw new Error("You can't skip a step that isn't optional.");
		}
	
		setActiveStep((prevActiveStep) => prevActiveStep + 1);
		setSkipped((prevSkipped) => {
		  const newSkipped = new Set(prevSkipped.values());
		  newSkipped.add(activeStep);
		  return newSkipped;
		});
	  };
	
	  const handleReset = () => {
		setActiveStep(0);
	  };




	async function populateQuote() {
		const req = await fetch('http://localhost:1337/api/quote', {
			headers: {
				'x-access-token': localStorage.getItem('token'),
			},
		})

		const data = await req.json()
		if (data.status === 'ok') {
			setQuote(data.quote)
		} else {
			alert(data.error)
		}
	}

	useEffect(() => {
		const token = localStorage.getItem('token')
		if (token) {
			const user = jwt.decode(token)
			if (!user) {
				localStorage.removeItem('token')
				history.replace('/')
			} else {
				populateQuote()
			}
		}
	}, [])

	async function updateQuote(event) {
		event.preventDefault()

		const req = await fetch('http://localhost:1337/api/quote', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'x-access-token': localStorage.getItem('token'),
			},
			body: JSON.stringify({
				quote: tempQuote,
			}),
		})

		const data = await req.json()
		if (data.status === 'ok') {
			setQuote(tempQuote)
			setTempQuote('')
		} else {
			alert(data.error)
		}
	}

	return (
		<div>
			<Box sx={{ flexGrow: 1 }}>
			      <AppBar position="static">
			        <Toolbar>
			          <IconButton
			            size="large"
			            edge="start"
			            color="inherit"
			            aria-label="menu"
			            sx={{ mr: 2 }}
			          >
			            <MenuIcon />
			          </IconButton>
			          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
			            My notes
			          </Typography>
			          <Button 
					  color="inherit"
					  href='/'
					  >Sign Out</Button>
			        </Toolbar>
			      </AppBar>
			    </Box>




<br/>
<br/>
<br/>
<Paper sx={{ p: 2, margin: 'auto', maxWidth: 1200, flexGrow: 1 }}>
			<Grid container justifyContent="center">
	<Box 
	sx={{ width: '85%',

}}
	
	>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};
          if (isStepOptional(index)) {
            labelProps.optional = (
              <Typography variant="caption">Any DB</Typography>
            );
          }
          if (isStepSkipped(index)) {
            stepProps.completed = false;
          }
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {activeStep === steps.length ? (
        <React.Fragment>
          <Typography sx={{ mt: 2, mb: 1 }}>
		  You have auth system!
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button onClick={handleReset}>Reset</Button>
          </Box>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Typography sx={{ mt: 2, mb: 1 }}>Step {activeStep + 1}</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Box sx={{ flex: '1 1 auto' }} />
            {isStepOptional(activeStep) && (
              <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                Skip
              </Button>
            )}

            <Button onClick={handleNext}>
              {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
            </Button>
          </Box>
        </React.Fragment>
      )}
    </Box>
	
	</Grid>
	</Paper>




	<br/>
	<br/>
	<br/>
	<Paper sx={{ p: 2, margin: 'auto', maxWidth: 700, flexGrow: 1 }}>
			<Grid container justifyContent="center" >
				<Box >
				<Typography variant='h3'>Your note: {quote || 'No quote found'}</Typography>
				<form onSubmit={updateQuote}>
					
					<Divider/>
					<br/>
				<TextField id="outlined-basic" label="note" variant="outlined" onChange={(e) => setTempQuote(e.target.value)} value={tempQuote}/>
				
					<Button size="large" variant="contained" type="submit" value="Update quote" >Update quote</Button>
				
				</form>
				</Box>
			</Grid>
				</Paper>





				<Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '50vh',
      }}
    >
      <CssBaseline />
      
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? theme.palette.grey[200]
              : theme.palette.grey[800],
        }}
      >
        <Container maxWidth="sm">
          <Typography variant="body1">
            Footer for MERN auth, just template for you :) 
          </Typography>
          <Copyright />
        </Container>
      </Box>
    </Box>

		</div>
	)
}

export default Dashboard
