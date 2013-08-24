
//Global variables
var SV_counter=0;
var SV_arrMsg = [];
var SV_arrCtl = [];
var Validators = [];

//Constants
var SV_HEADING = "<span>Please correct the following and try again:</span>";
var SV_Extra ="";

String.prototype.trim = function() 
{
 return this.replace(/^\s+|\s+$/g,"");
}

function CValidator(obj_target)
{
	//assign validation methods
	this.ValidateRequired = SV_ValidateRequired;
	this.ValidateMaxLength=SV_ValidateMaxLength;
	this.ValidateRange=SV_ValidateRange;
	this.ValidateCompare=SV_ValidateCompare;
	this.CustomMessage=SV_CustomMessage;
	//this.ValidateExtension=VS_ValidateExtension;
	this.ParseDate=SV_ParseDate;
	this.Trim = SV_Trim;
	this.Validate = SV_Validate;
	this.IsInvalid = SV_IsInvalid;
	this.DisplayMessage= SV_DisplayMessage;
	this.ValidateExpiryDate=SV_ValidateExpiryDate;
	this.ValidateTransactionDate=SV_ValidateTransactionDate;
	this.ValidateChildAgeLess4=SV_ValidateChildAgeLess4;
	this.ValidateChildAgeBetween416=SV_ValidateChildAgeBetween416;
	this.ValidateAnonAge16=SV_ValidateAnonAge16;
	this.ValidateDateTest = SV_ValidateDateTest;
	
	//validate input parameters
	//if (!obj_target)
	//	return SV_error("Error calling the CValidator: no target control specified");
	
	this.target  = obj_target;
	//this.arrMsg  = SV_arrMsg;
	//this.arrCtl  = SV_arrCtl;
	this.arrMsg  = [];
	this.arrCtl  = [];
	this.counter = 0;
	this.heading = SV_HEADING;
	this.Extra   = "";
	this.ShowAlert=false;
	this.Scroll=true;
	
	// register in global collections
	this.id = Validators.length;
	Validators[this.id] = this;	

}

//========================================================
//Validation Controls Starts Here....
//========================================================

function SV_CustomMessage(ctrlId,Msg)
{
	if(this.IsInvalid(ctrlId))
	{
		this.arrMsg[this.counter]= Msg;
		this.arrCtl[this.counter]=ctrlId;
		this.counter++;
	}
}

//Required Field Validator
function SV_ValidateRequired(ctrlId,Msg)
{
	ctl = document.getElementById(ctrlId);
	blnFlag=false;
	switch(ctl.type)
	{
		case "text":  //textbox,password,file,textarea
		if(this.Trim(ctl.value)=="")
				blnFlag=true;	
		break;
		case "password":
		case "file":
		case "textarea":
		case "hidden":		
			if(this.Trim(ctl.value)=="")
				blnFlag=true;	
		break;
		case "select-one": //dropdown
			if(ctl.selectedIndex ==0 || ctl.selectedIndex ==-1 )
				blnFlag=true;
		break;
		case "select-multiple": //listbox
			if(ctl.selectedIndex==-1)
				blnFlag=true
		break;
		case "checkbox":
		case "radio":
			if(!ctl.checked)
				blnFlag=true;		
		break;
	}
	
	if(blnFlag)
	{
		if(this.IsInvalid(ctrlId))
		{
			this.arrMsg[this.counter]= Msg;
			this.arrCtl[this.counter]=ctrlId;
			this.counter++;
		}
		return false;
	}
	else
		return true;
}

/*
function SV_ValidateMaxLength(ctrlId,Msg,maxLength)
{
	ctl = document.getElementById(ctrlId);

	if(ctl.value.length > maxLength)
	{
		if(this.IsInvalid(ctrlId))
		{
			this.arrMsg[this.counter]= Msg;
			this.arrCtl[this.counter]=ctrlId;
			this.counter++;
		}
		return false;
	}
	else
		return true;	
}
*/
function SV_ValidateMaxLength(ctrlId,Msg,maxLength,blnRequired,reqMsg)
{
	ctl = document.getElementById(ctrlId);

	//Check if the control is required.
	if(blnRequired)
	{
		if(!this.ValidateRequired(ctrlId,reqMsg))
			return false;
	}
	else //if not required some value should be there.
	{
		if(this.Trim(ctl.value)=="")
			return true;
	}
	
	if(ctl.value.length > maxLength)
	{
		if(this.IsInvalid(ctrlId))
		{
			this.arrMsg[this.counter]= Msg;
			this.arrCtl[this.counter]=ctrlId;
			this.counter++;
		}
		return false;
	}
	else
		return true;	
}


function SV_ValidateCompare(ctrlId_1,operator,ctrlId_2,type,Msg)
{

	var regEx;
	var blnFlag=false;
	
	ctl_1 = document.getElementById(ctrlId_1);
	ctl_2 = document.getElementById(ctrlId_2);
	ctl_1_val = this.Trim(ctl_1.value);
	ctl_2_val = this.Trim(ctl_2.value);
			
	switch(type)
	{
		case "STRING":
			if( ctl_1_val=="")return true;
			fromStart=ctl_1_val;
			toEnd=ctl_2_val;
			break;
		case "DATE":
			if( ctl_1_val=="" || ctl_2_val=="")return true;
			fromStart=ctl_1_val;
			toEnd=ctl_2_val;
			var sMatchArray = fromStart.split("/");
            var sDay = parseInt(sMatchArray[0],10);
            var sMonth = parseInt(sMatchArray[1],10);
            var sYear = parseInt(sMatchArray[2],10);
            fromStart = new Date(sYear, sMonth-1, sDay, 0, 0, 0,0);
            var eMatchArray = toEnd.split("/");
            var eDay = parseInt(eMatchArray[0],10);
            var eMonth = parseInt(eMatchArray[1],10);
            var eYear = parseInt(eMatchArray[2],10);
            toEnd = new Date(eYear, eMonth-1, eDay, 0, 0, 0,0);
            break;
		case "DOUBLE":
			if( ctl_1_val=="" || ctl_2_val=="")return true;
			fromStart=parseFloat(ctl_1_val);
			toEnd=parseFloat(ctl_2_val);
			break;
		case "INTEGER":
			if( ctl_1_val=="" || ctl_2_val=="")return true;
			fromStart=parseInt(ctl_1_val);
			toEnd=parseInt(ctl_2_val);
			break;
	}	//end of outer switch
	
	switch(operator)
	{
		case "=":
		    if(type=="DATE")
		    {
		        if(fromStart==toEnd)
		        {
				    blnFlag=true;
				}
		    }else
		    {
		        if(fromStart==toEnd)
		        {
				    blnFlag=true;
				}
		    }
			
			break;
		case "<=":
		    if(type=="DATE")
		    {
		        if(fromStart<=toEnd)
		        {
		        
				    blnFlag=true;
				}
		    }else
		    {
			    if(fromStart<=toEnd)
			    {
				    blnFlag=true;
			    }
			}
			break;
			
		case ">=":
		    if(type=="DATE")
		    {
		        if(fromStart>=toEnd)
		        {
				    blnFlag=true;
				}
		    }else
		    {
			    if(fromStart>=toEnd)
			    {
				    blnFlag=true;
			    }
			}
			break;
		case "<":
			if(type=="DATE")
		    {
		        if(fromStart<toEnd)
		        {
				    blnFlag=true;
				}
		    }else
		    {
		   	    if(fromStart<toEnd)
		   	    {
				    blnFlag=true;
				}
			}
			break;
		case ">":
		
		    if(type=="DATE")
		    {
		        if(fromStart>toEnd)
		        {
		           blnFlag=true;
				}
		    }else
		    {
			    if(fromStart>toEnd)
				    blnFlag=true;
		    }
			    break;
	} 
		
	if(!blnFlag)
	{
		if(this.IsInvalid(ctrlId_1))
		{
			this.arrMsg[this.counter]= Msg;
			this.arrCtl[this.counter]=ctrlId_1;
			this.counter++;
		}
		return false;	
	}
	else
		return true;
}

function SV_ValidateRange(ctrlId,Msg,from,to,type,blnRequired,reqMsg)
{
	ctl = document.getElementById(ctrlId);

	//Check if the control is required.
	if(blnRequired)
	{
		if(!this.ValidateRequired(ctrlId,reqMsg))
			return false;
	}
	else //if not required some value should be there.
	{
		if(this.Trim(ctl.value)=="")
			return true;
	}
		
	var regEx;
	var blnFlag=false;
	
	switch(type)
	{
		case "DOUBLE":
			regEx = /^((\d*)|(\d*\.\d{2})|(\d*)|(\d*\.\d{1}))$/;	
			blnFlag = regEx.test(ctl.value);
			if(from==0 && to==0)break;
			if(blnFlag)
			{
				val = parseFloat(ctl.value);
				if(val >= from && val <= to)
					blnFlag=true;
				else
					blnFlag=false; 
			}	
		break;
		case "INTEGER":
			regEx = /^(\d*)$/;	
			blnFlag = regEx.test(ctl.value);
			if(from==0 && to==0)break;
			if(blnFlag)
			{
				val = parseInt(ctl.value);
				if(val >= from && val <= to)
					blnFlag=true;
				else
					blnFlag=false; 
			}	
		break;
		case "DATE":
			tempMsg=this.ParseDate(ctl.value);
			
			if(tempMsg=="") //check the range(date is valid)
			{
				if(from==0 && to==0)
				{
					blnFlag=true;
					break;
				}
				fromMilli = Date.parse(from)/60/60/60/24;
				toMilli = Date.parse(to)/60/60/60/24;
				ctlMilli = Date.parse(ctl.value)/60/60/60/24;
							
				if(ctlMilli >=fromMilli && ctlMilli <=toMilli)
				{
					blnFlag=true;
				}
				else
					blnFlag=false;
				
			}
			else
			{
				Msg += "(" + tempMsg + ")";
				blnFlag=false;
			}
			
		break;
		case "MAXLENGTH":
			if(ctl.value.length > to)
				blnFlag=false;
			else
				blnFlag=true;
		break;
	}
	
	if(!blnFlag)
	{
		if(this.IsInvalid(ctrlId))
		{
			this.arrMsg[this.counter]= Msg;
			this.arrCtl[this.counter]=ctrlId;
			this.counter++;
		}
		return false;	
	}
	else
		return true;
}

function SV_Validate(strType,ctrlId,Msg,blnRequired,regMsg)
{
	
	ctl = document.getElementById(ctrlId);
	
	//Check if the control is required.
	if(blnRequired)
	{
		if(!this.ValidateRequired(ctrlId,regMsg))
			return false;
	}
	else //if not required some value should be there.
	{
		if(this.Trim(ctl.value)=="")
			return true;
	}
		
	
	var blnFlag=false;
	var blnFlagsurname=false;
	var blnFlagvalue=false;
	var regEx;
	var regExsurname;
	switch(strType)
	{
	
		case "EMAIL":
			regEx = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;;		
			blnFlag=regEx.test(ctl.value);
			break;
		case "URL":
			regEx = /^(file|http|https):\/\/\S+$/;
			//regEx = /^(file|http|https):\/\/\S+\.(com|net|org|info|biz|ws|us|tv|cc)$/;
			blnFlag=regEx.test(ctl.value);
			break;
		case "ABN":
			regEx = /^[ 0-9a-zA-Z]+$/; //allowed
			blnFlag=regEx.test(ctl.value);
			if(blnFlag)
			{
				regEx = /([0-9(\b)].*){11}/; //Atleast one number
				blnFlag=regEx.test(ctl.value);
			}
			break;
		case "PHONE":
		    regEx = /^[\-\s\(\)0-9]+$/; //allowed
			blnFlag=regEx.test(ctl.value);
			if(blnFlag)
			{
				regEx = /[0-9]{8,10}/; //Atleast one number
				blnFlag=regEx.test(ctl.value);
			}
			break;
			case "MOBILEPHONE":
		    regEx = /^[\-\s\(\)0-9]+$/; //allowed
			blnFlag=regEx.test(ctl.value);
			if(blnFlag)
			{
				regEx = /[0-9]{10}/; //Atleast one number
				blnFlag=regEx.test(ctl.value);
			}
			break;
		case "POSTCODE":	
			regEx = /^[\-\s\(\)0-9]+$/; //allowed
			blnFlag=regEx.test(ctl.value);
			if(blnFlag)
			{
				regEx = /[0-9]{4}/; 
				blnFlag=regEx.test(ctl.value);
			}
			break;
		case "PIN":	
		     
		     var strPin = ctl.value.trim();   
		     if(strPin.length == 0)
		     {
		     blnFlag=false;
		     }
		     else
		     {
			    regEx = /^[\-\s\(\)0-9]+$/; //allowed
			    blnFlag=regEx.test(ctl.value);
			    if(blnFlag)
			    {
				    regEx = /[0-9]{4}/; //Atleast Four number
				    blnFlag=regEx.test(ctl.value);
			    }
			}
			break;
		case "MYKINUMBER":
		        regEx = /[0-9]{15}/;
				blnFlag=regEx.test(ctl.value);
			
			break;
		case "DEVICEID":
	        regEx = /[0-9]{8}/;
			blnFlag=regEx.test(ctl.value);
		    break;
		case "PASSWORD":
		    //regEx = /^.*(?=.{6,8})(?=.*\d)([a-zA-Z]).*$/;
			regEx = /^.*(?=.{6,15})(?=.*\d)(?=.*[a-zA-Z]).*$/;	
			blnFlag=regEx.test(ctl.value);
			break;
		case "FEEDBACK":
			regEx = /^[^+]*$/;	
			blnFlag=regEx.test(ctl.value);
			break;
		case "USERNAME":
			regEx = /^[^\s]+$/; //spaces not allowed
			blnFlag=regEx.test(ctl.value.trim());
			if(blnFlag)
			{
				regEx = /^[A-Za-z 0-9]{8,15}$/;//^[a-zA-Z'.\s\w]{8,15}$/; //Atleast one char
				blnFlag=regEx.test(ctl.value);
			}
			break;
		case "SECURITYANSWER":
			//regEx = /^[^\s]+$/; //spaces not allowed
			//blnFlag=regEx.test(ctl.value);
			//if(blnFlag)
			//{
				regEx = /^[a-zA-Z 0-9]{4,30}$/; //Atleast one char
				blnFlag=regEx.test(ctl.value);
			//}
			break;
		case "NAMES":
		   
			//regEx = /^[a-zA-Z .'0-9]+$/; 
			regEx = /^[a-zA-Z .']+$/; 
			blnFlag=regEx.test(ctl.value);
			if(blnFlag)
			{
				regEx = /[a-zA-Z]{1}/; //atleast one char
				blnFlag=regEx.test(ctl.value);
			}
			break;
		case "EXTENSION":
			regEx = new RegExp("^(.*)(\\." + this.Extra + ")$");
			strTemp=ctl.value.toLowerCase();
			match = strTemp.match(regEx);
			if (match != null)
				blnFlag=true;
			break;
		case "TIME":
		    regEx = /^((0?[1-9]|1[012])(:[0-5]\d){0,2})$/;	
			blnFlag = regEx.test(ctl.value);	
			break;	
		case "TEXT":
		    //alows Alphanumeric values
		    regEx =/^[A-Za-z 0-9]+$/;	
			blnFlag = regEx.test(ctl.value);
			break;
//CR 13277 (allow hyphen in suburb and streetname)        case "SUBURB":
            //alows Alphanumeric values
            regEx = /^[A-Za-z 0-9-']+$/;
            blnFlag = regEx.test(ctl.value);
            break;
        case "STREETNAME":
            //alows Alphanumeric values
            regEx = /^[A-Za-z 0-9-]+$/;
            blnFlag = regEx.test(ctl.value);
            break;
		case "SURNAME":
		    //alows Alpha values and - ' and space
		    if(ctl.value.trim().length == 1)
		    {
		             var re = /^([a-zA-Z])$/;
		             blnFlag = re.test(ctl.value.trim());
		    }
		    else
		    {
			        regEx = /^[a-zA-Z][a-zA-Z\-\'\s]*[a-zA-Z]$/;
			        blnFlagsurname = regEx.test(ctl.value.trim());
	                if (blnFlagsurname ==true)
	                {
	                    regEx = /([\-\'\s][\'\-\s])/;
	                    blnFlag = regEx.test(ctl.value.trim());
	                    blnFlag = ! blnFlag;
	                }
	        }
			break;
			// <!-- Ref (Defect:9921): Initials (DS) : Date (10/16/08): Desc (Added new function to validate unit house number) -->
		case "UNITHOUSENO":
		    regEx =/^[A-Za-z\-\/0-9]+$/;	
		    blnFlag = regEx.test(ctl.value);	
			break;
		case "MAIL":
		    regEx=/^[\s\a-zA-Z\,\(\)\n0-9].+$/; 
		    blnFlag = regEx.test(ctl.value);	
			break;
		case "ABNNO":
		    //To validate ABN Number
		    regEx=/^[A-Za-z 0-9]{11}/;
		    blnFlag = regEx.test(ctl.value);	
			break;
		case "NUMBER":
		    regEx=/^(\d*)$/;	
		    blnFlag = regEx.test(ctl.value);	
			break;
		case "CRNNUMBER":
		    regEx=/^[0-9]{9}[A-Z]{1}/;
		    blnFlag = regEx.test(ctl.value);	
			break;
		case "DVANUMBER":
		    regEx=/^[A-Z]{2}[0-9]{7}/;
		    blnFlag = regEx.test(ctl.value);	
			break;
		case "SENIORCARDNO":
		    regEx=/^[A-Za-z 0-9]{8}/;
		    blnFlag = regEx.test(ctl.value);	
			break;
		case "DEVICEID":
		    regEx = /^[\-\s\(\)0-9]+$/; //allowed
			blnFlag=regEx.test(ctl.value);
			if(blnFlag)
			{
				regEx = /[0-9]{8}/; //Atleast one number
				blnFlag=regEx.test(ctl.value);
			}
			break;
		case "WORNSECURITY":
		    regEx = /^[\-\s\(\)0-9]+$/; //allowed
			blnFlag=regEx.test(ctl.value);
			if(blnFlag)
			{
				regEx = /[0-9]{4}/; //Atleast one number
				blnFlag=regEx.test(ctl.value);
			}
			break;
		case "WORN":
		    regEx = /^[\-\s\(\)0-9]+$/; //allowed
			blnFlag=regEx.test(ctl.value);
			if(blnFlag)
			{
				regEx = /[0-9]{4,19}/; //Atleast one number
				blnFlag=regEx.test(ctl.value);
			}
			break;		
		case "CPOWORN":
		    regEx = /[A-Za-z 0-9]{4,19}/; //Atleast one number
			blnFlag = regEx.test(this.Trim(ctl.value));	
			break;
		case "DOUBLE":
			regEx = /^((\d*)|(\d*\.\d{2})|(\d*)|(\d*\.\d{1}))$/;	
			blnFlag = regEx.test(ctl.value);
			if(from==0 && to==0)break;
			if(blnFlag)
			{
				val = parseFloat(ctl.value);
				if(val >= from && val <= to)
					blnFlag=true;
				else
					blnFlag=false; 
			}	
		    break;
		    case "CREDITCARDNO":
		         regEx = /[0-9]{15,16}/;
				blnFlag=regEx.test(ctl.value);
			
			break;
			case "SECURITYCODE":
			    regEx=/^[0-9]{3}$|^[0-9]{4}$/;
			    blnFlag=regEx.test(ctl.value);
			    break;
			case "BSB":
			     regEx = /[0-9]{7,8}/;
				blnFlag=regEx.test(ctl.value);
			    break;
			case "ACCOUNTNUMBER":
			    regEx=/[0-9]{9}/;
			    blnFlag=regEx.test(ctl.value);
			    break;
			
			
	}
	
	if(!blnFlag)
	{
		if(this.IsInvalid(ctrlId))
		{
			this.arrMsg[this.counter]= Msg;
			this.arrCtl[this.counter]=ctrlId;
			this.counter++;
		}
		return false;	
	}
	else
		return true;
}


//=======================================================
//Validations controls ends here...
//=======================================================

//Check if the control is already invalid.
function SV_IsInvalid(currentCtlId)
{
	var blnFlag=true;
	for(i=0;i<this.arrCtl.length;i++)
	{
		if(this.arrCtl[i]==currentCtlId)
			blnFlag=false;
		else
			blnFlag=true;	
	}
	return blnFlag;
}

//Parse Date
function SV_ParseDate(str_date) {

	var arr_date = str_date.split('/');
	var RE_NUM = /^\-?\d+$/;
		
	if (arr_date.length != 3) return ("Invalid date format: '" + str_date + "'.\nFormat accepted is mm/dd/yyyy.");
	if (!arr_date[1]) return ("Invalid date format: '" + str_date + "'.\nNo day of month value can be found.");
	if (!RE_NUM.exec(arr_date[1])) return  ("Invalid day of month value: '" + arr_date[1] + "'.\nAllowed values are unsigned integers.");
	if (!arr_date[0]) return  ("Invalid date format: '" + str_date + "'.\nNo month value can be found.");
	if (!RE_NUM.exec(arr_date[0])) return  ("Invalid month value: '" + arr_date[0] + "'.\nAllowed values are unsigned integers.");
	if (!arr_date[2]) return  ("Invalid date format: '" + str_date + "'.\nNo year value can be found.");
	if (!RE_NUM.exec(arr_date[2])) return  ("Invalid year value: '" + arr_date[2] + "'.\nAllowed values are unsigned integers.");

	var dt_date = new Date();
	dt_date.setDate(1);

	if (arr_date[0] < 1 || arr_date[0] > 12) return  ("Invalid month value: '" + arr_date[0] + "'.\nAllowed range is 01-12.");
	dt_date.setMonth(arr_date[0]-1);
	 
	if (arr_date[2] < 100) arr_date[2] = Number(arr_date[2]) + (arr_date[2] < NUM_CENTYEAR ? 2000 : 1900);
	dt_date.setFullYear(arr_date[2]);

	var dt_numdays = new Date(arr_date[2], arr_date[0], 0);
	dt_date.setDate(arr_date[1]);
	if (dt_date.getMonth() != (arr_date[0]-1)) return  ("Invalid day of month value: '" + arr_date[1] + "'.\nAllowed range is 01-"+dt_numdays.getDate()+".");

	return ("")
}

//Trim
function SV_Trim(s) {
	var m = s.match(/^\s*(\S+(\s+\S+)*)\s*$/);
	return (m == null) ? "" : m[1];
}

//Compare dates


//Display Message
function SV_DisplayMessage()
{
	//No Errors please return.
	if(this.arrMsg.length==0)
		return true;
	if(!this.ShowAlert)
	{
		first = "<ul>";
		pre = "<li>";
		post = "</li>";
		last = "</ul>";
	}
	else
	{
		first = "\n";
		pre = ">> ";
		post = "\n";
		last = "\n";
	}		
	strMsg = "";
	
	//Clear the old message
	this.target.innerHTML="";
	
	//Create message for span
	for(i=0;i<this.arrMsg.length;i++)
	{
		strMsg += pre + this.arrMsg[i] + post;		
	}
	
	strMsg = this.heading + first + strMsg + last;
		
	//Show the message
	if(this.ShowAlert)
		alert(strMsg);
	else
	{
		this.target.innerHTML = strMsg;
		//Go to top of the page.	
		if(this.Scroll)
			window.scrollTo(0,0);
	}
	
	//Clear objects
	this.arrMsg=[];
	this.arrCtl=[];
	this.counter=0;
	this.ShowAlert=false;
	this.Scroll=true;

	return false;
}
//To validate Expiry date
function SV_ValidateExpiryDate(ctrlId,Msg,blnRequired,regMsg)
{
	ctl = document.getElementById(ctrlId);
	if(blnRequired)
	{
	    if(!this.ValidateRequired(ctrlId,regMsg))
			return false;
	}
	else //if not required some value should be there.
	{
		if(this.Trim(ctl.value)=="")
			return true;
	}
	var str_date=	ctl.value
	var arr_date = str_date.split('/');
	var blnFlag=false;
	 var now = new Date();
     var monthnumber = now.getMonth();
     monthnumber=eval(monthnumber)+1;
    var yearCurrent= now.getYear();
    
    
    
 
	if ((eval(arr_date[0]) <= eval(monthnumber)) && (eval(arr_date[1]) <=eval(yearCurrent)))
         blnFlag=false;
    else if(eval(arr_date[1]) == eval(yearCurrent))
	{
	 if (eval(arr_date[0]) <= eval(monthnumber)) 
	    blnFlag=false;
	 else
	     blnFlag=true;
	}
if ((eval(arr_date[0]) < eval(monthnumber)) && (eval(arr_date[1]) < eval(yearCurrent)))
 {
         blnFlag=false;
 }
    else if(eval(arr_date[1]) == eval(yearCurrent))
 {
     
      if (eval(arr_date[0]) < eval(monthnumber)) 
         blnFlag=false;
      else
          blnFlag=true;
 }
	else
	    blnFlag=true;
	
	if(!blnFlag)
	{
		if(this.IsInvalid(ctrlId))
		{
			this.arrMsg[this.counter]= Msg;
			this.arrCtl[this.counter]=ctrlId;
			this.counter++;
		}
		return false;	
	}
	else
		return true;
	
}
		
//To validate Expiry date
function SV_ValidateTransactionDate(ctrlId,Msg,blnRequired,regMsg)
{
	ctl = document.getElementById(ctrlId);
	if(blnRequired)
	{
	    if(!this.ValidateRequired(ctrlId,regMsg))
			return false;
	}
	else //if not required some value should be there.
	{
		if(this.Trim(ctl.value)=="")
			return true;
	}
	var str_date=	ctl.value
	var arr_date = str_date.split('/');
	var blnFlag=false;
	 var now = new Date();
     var monthnumber = now.getMonth();
     monthnumber=eval(monthnumber)+1;
    var yearCurrent= now.getYear();
   
	if ((eval(arr_date[0]) <= eval(monthnumber)) && (eval(arr_date[1]) <= eval(yearCurrent)))
         blnFlag=true;
    else if(eval(arr_date[1]) == eval(yearCurrent))
	{
	 if (eval(arr_date[0]) < eval(monthnumber)) 
	    blnFlag=true;
	 else
	     blnFlag=false;
	}
	else
	    blnFlag=true;
	
	if(!blnFlag)
	{
		if(this.IsInvalid(ctrlId))
		{
			this.arrMsg[this.counter]= Msg;
			this.arrCtl[this.counter]=ctrlId;
			this.counter++;
		}
		return false;	
	}
	else
		return true;
	
}
				
//Display Error
function SV_error (str_message) {
	alert (str_message);
	return null;
}

function SV_ValidateChildAgeLess4(ctrlId,Msg)
{
	ctl = document.getElementById(ctrlId);
	var str_date=	ctl.value
	var arr_date = str_date.split('/');
	var blnFlag=false;
   //when date sent is in the form 0/0/1965 or date and month are 0
   
   if(arr_date[1] == "0" || arr_date[0] == "0")
   {
    blnFlag=false;
   }
   else
   {
       //if(calculateage(arr_date[2], arr_date[1], arr_date[0], "years", 0) < 4)
       if(CalcAge(arr_date[1]+"/"+arr_date[0]+"/"+arr_date[2]) < 4)
       {
        blnFlag=false;
       }
       else
       {
        blnFlag=true;
       }
   }
	if(!blnFlag)
	{
		this.arrMsg[this.counter]= Msg;
		this.arrCtl[this.counter]=ctrlId;
		this.counter++;
		return false;	
	}
	else
		return true;
	
}

function SV_ValidateChildAgeBetween416(ctrlId,Msg)
{
	ctl = document.getElementById(ctrlId);
	var str_date=	ctl.value
	var arr_date = str_date.split('/');
	var blnFlag=false;
	//when date sent is in the form 0/0/1965 or date and month are 0
   if(arr_date[1] == "0" || arr_date[0] == "0")
   {
    blnFlag=false;
   }
   else
   {
        if(CalcAge(arr_date[1]+"/"+arr_date[0]+"/"+arr_date[2]) < 4 ||
            CalcAge(arr_date[1]+"/"+arr_date[0]+"/"+arr_date[2]) >= 17)

       {
        blnFlag=false;
       }
       else
       {
        blnFlag=true;
       }
    }       
	if(!blnFlag)
	{
		this.arrMsg[this.counter]= Msg;
		this.arrCtl[this.counter]=ctrlId;
		this.counter++;
		return false;	
	}
	else
		return true;
	
}

function SV_ValidateAnonAge16(ctrlId,Msg)
{
	ctl = document.getElementById(ctrlId);
	var str_date=	ctl.value
	var arr_date = str_date.split('/');
	var blnFlag=false;
	//when date sent is in the form 0/0/1965 or date and month are 0
       //if(calculateage(arr_date[2], arr_date[1], arr_date[0], "years", 0) < 16)
       if(CalcAge(arr_date[1]+"/"+arr_date[0]+"/"+arr_date[2]) < 17)
       {
        
        blnFlag=false;
       }
       else
       {
        blnFlag=true;
       }
	if(!blnFlag)
	{
		this.arrMsg[this.counter]= Msg;
		this.arrCtl[this.counter]=ctrlId;
		this.counter++;
		return false;	
	}
	else
		return true;
	
}

function SV_ValidateDateTest(ctrlId, Msg)
{
	
	ctl = document.getElementById(ctrlId);
	var str_date=ctl.value;
	var blnFlag=false;
	//when date sent is in the form 0/0/1965 or date and month are 0
	
       if(validateDate(str_date) == false)
       {
        blnFlag=false;
       }
       else
       {
        blnFlag=true;
       }
	if(!blnFlag)
	{
		this.arrMsg[this.counter]= Msg;
		this.arrCtl[this.counter]=ctrlId;
		this.counter++;
		return false;	
	}
	else
		return true;
	
}

//Sample usage
//calculateage (year, month, day, unit, decimals)
//Unit can be "years", "months", or "days"
//Decimals specifies demical places to round to (ie: 2)
//calculateage(1977, 12, 23, "days", 0)
//calculateage(1977, 12, 23, "months", 0)
//calculateage(1977, 12, 23, "years", 0)
function calculateage(yr, mon, day, unit, indecimal)
{
    var one_day = 1000*60*60*24;
    var one_month = 1000*60*60*24*30;
    var one_year = 1000*60*60*24*30*12;

    var today = new Date();
    var pastdate = new Date(yr, mon-1, day);

    var countunit = unit;
    var decimals = indecimal;

    finalunit = (countunit == "days")? one_day : (countunit == "months")? one_month : one_year;
    decimals = (decimals <= 0)? 1 : decimals*10;

    if (unit != "years")
    {
        return (Math.floor((today.getTime()-pastdate.getTime())/(finalunit)*decimals)/decimals);
    }
    else
    {
        yearspast=today.getFullYear()-yr-1;
        tail=(today.getMonth()>mon-1 || today.getMonth()==mon-1 && today.getDate()>=day)? 1 : 0;
        pastdate.setFullYear(today.getFullYear());
        pastdate2=new Date(today.getFullYear()-1, mon-1, day);
        tail=(tail==1)? tail+Math.floor((today.getTime()-pastdate.getTime())/(finalunit)*decimals)/decimals : Math.floor((today.getTime()-pastdate2.getTime())/(finalunit)*decimals)/decimals;
        return (yearspast+tail);
    }
}

function CalcAge(obj) {
  var DoB    = Date.parse(obj);
  

  var DoC    = new Date();
  var DoCMonth = DoC.getMonth() + 1;
  var DoCDay = DoC.getDate();
  var DoCYear = DoC.getYear();
  
  var DateofB  = new Date(DoB);
  var DoBYear    = DateofB.getFullYear();
  
  var DoBMonth    = DateofB.getMonth()+1;
  var DoBDay    = DateofB.getDate();

  if(Math.floor(DoC.getYear()/1900) < 1)
    DoCYear = DoCYear + 1900;
  else
   DoCYear = DoC.getYear();
  var strDOC = new String(DoCMonth + "/" + DoCDay + "/" + DoCYear);
  DoC = Date.parse(strDOC);
  var AOkay  = true;

  // Check dates for validity
  if ((DoB==null)||(isNaN(DoB))) {
    //alert("Date of Birth is invalid.");
    AOkay = false;
  }
  if ((DoC==null)||(isNaN(DoC))) {
    //alert("Specified Date is invalid.");
    AOkay = false;
  }
  if (DoB > DoC) {
    //alert("The Date of Birth is after the specified date.");
    AOkay = false;
  }
  if (AOkay) {
    //var AgeDays  = 0;
    //var AgeWeeks = 0;
    //var AgeMonth = 0;
    var AgeYears = 0;
    //var AgeRmdr  = 0;

//    mSecDiff   = DoC - DoB;
//    AgeDays  = mSecDiff / 86400000;
//    AgeWeeks = AgeDays / 7;
//    AgeMonth = AgeDays / 30.4375;
//    AgeYears = AgeDays / 365.24;    
//    AgeYears = Math.floor(AgeYears);
//    AgeRmdr  = (AgeDays - AgeYears * 365.24) / 30.4375;

//    AgeDays  = Math.round(AgeDays * 10) / 10;
//    AgeWeeks = Math.round(AgeWeeks * 10) / 10;
//    AgeMonth = Math.round(AgeMonth * 10) / 10;
//    AgeRmdr  = Math.round(AgeRmdr * 10) / 10;
//    return AgeYears;
    AgeYears= DoCYear - DoBYear;
    
      if(AgeYears > 0)
      {
         if( DoCMonth > DoBMonth)
           return AgeYears;

          else if(DoCMonth < DoBMonth)
          return AgeYears-1;

         else if(DoCMonth == DoBMonth)
         {
          
           if (DoCDay >= DoBDay)
           {
           return AgeYears;
           }
           else
           {
           return AgeYears-1;
           }
         }
       }
       else
       {
       return 0;
       }
         
  }
}

function validateDate(fld) {
    
    var RegExPattern = /^((((0?[1-9]|[12]\d|3[01])[\.\-\/](0?[13578]|1[02])[\.\-\/]((1[6-9]|[2-9]\d)?\d{2}))|((0?[1-9]|[12]\d|30)[\.\-\/](0?[13456789]|1[012])[\.\-\/]((1[6-9]|[2-9]\d)?\d{2}))|((0?[1-9]|1\d|2[0-8])[\.\-\/]0?2[\.\-\/]((1[6-9]|[2-9]\d)?\d{2}))|(29[\.\-\/]0?2[\.\-\/]((1[6-9]|[2-9]\d)?(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00)|00)))|(((0[1-9]|[12]\d|3[01])(0[13578]|1[02])((1[6-9]|[2-9]\d)?\d{2}))|((0[1-9]|[12]\d|30)(0[13456789]|1[012])((1[6-9]|[2-9]\d)?\d{2}))|((0[1-9]|1\d|2[0-8])02((1[6-9]|[2-9]\d)?\d{2}))|(2902((1[6-9]|[2-9]\d)?(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00)|00))))$/;
    
    if ((RegExPattern.test(fld)) ) {
        
        return true;
    } else {
        
        return false;
    } 
}