var holders = function()
{
	var holder = [];
	
	this.add = function(input)
	{
		holder.push(input)
	}
	
	this.show = function()
	{
		
		return(holder.slice(0))
	}
}

Transaktioner = new holders();

var Konto = function(id, saldo, ejer, rentefod)
{
	if(typeof(id) == "number", typeof(saldo) == "number", typeof(ejer) == "string")
	{
		var that = {}
		
		var id = id;
		var saldo = saldo;
		var ejer = ejer;
		var rentefod = rentefod;
		
		Object.defineProperty
		(
			that, "id",
			{
				"get":function()
				{
					return(id)
				},
				enumerable: true
			}
		)
		
		Object.defineProperty
		(
			that, "saldo", 
			{
				"get": function()
				{
					return(saldo)
				},
				enumerable: true
			}
		);
		
		
		that.udtraek = function(belob)
		{
			if(typeof(belob) == "number" && that.validerUdtraek(belob))
			{
				saldo = saldo - belob;
			}
		}
		
		that.indsaet = function(belob)
		{
			if(typeof(belob) == "number" && that.validerIndaet(belob))
			{
				saldo = saldo + belob
			}
		}
		
		that.validerUdtraek = function(belob)
		{
			if(saldo >= belob && belob > 0)
			{
				return(true)
			}
			else{return(false)}
		}
		
		that.validerIndaet = function()
		{
			return(true)
		}
	}
	else{throw("Fejl i enten id'et eller saldo'en eller ejer")}
	
	return(that)
}

var KasseKradit = function(id, saldo, ejer, rentefod, overtrek)
{

	var that = Konto(id, saldo, ejer, rentefod)
	
	that.validerUdtraek = function(belob)
	{
		if(that.saldo + overtrek >= belob && belob > 0)
		{
			return(true)
		}
		else{return(false)}
	}
	
	return(that)
}

var Transaktion = function(fraKonto, tilKonto, belob, teller)
{
	if(typeof(fraKonto) == "object" && typeof(tilKonto) == "object" && typeof(belob) == "number" && typeof(teller) == "object")
	{
		var that = {}
	
		var fraKonto = fraKonto
		var tilKonto = tilKonto
		var belob = belob
		var teller = teller
		
		var erBrugt = false
		
		that.udfor = function()
		{
			if(that.valider() == true)
			{
				fraKonto.udtraek(belob)
				tilKonto.indsaet(belob)
				Transaktioner.add({"fra": JSON.stringify(fraKonto), "til": JSON.stringify(tilKonto), "belob": belob, "teller": teller})
				erBrugt = true
				return("overførslen gik igemmen")
			}
			else{return("Kan ikke valider overførslen")}
		}
		that.valider = function()
		{
			if(fraKonto.validerUdtraek(belob) == true && tilKonto.validerIndaet(belob) == true && erBrugt == false)
			{
				return(true)
			}
			else{return(false)}
		}
		return(that)
	}
	else{throw("Fejl ved fra konten, til konten, beløbet eller telleren")}
}

var ATMtransaktion = function(kontoen, atm, belob, ATMid)
{
	var that = {}//Transaktion(kontoen, atm, belob, ATMid)
	
	var kontoen = kontoen
	var atm = atm
	var belob = belob
	var ATMid = ATMid
	
	var erBrugt = false
	
	that.udfor = function(indUd)
	{
	//ind på konto
		if(indUd == "ind")
		{
			if(kontoen.validerIndaet() == true)
			{
				kontoen.indsaet(belob)
				Transaktioner.add({"fra": atm, "til": kontoen, "belob": belob, "teller":ATMid})
				erBrugt = true
				return("du indsatte: " + belob + "kr på din konto")
			}
			else{return("kan ikke valider indætingen")}
			
		}
		else if(indUd == "ud")
		{
			if(kontoen.validerUdtraek(belob) == true && atm.validerUdtraek(belob))
			{
				atm.udtraek(belob)
				kontoen.udtraek(belob)
				Transaktioner.add({"fra": kontoen, "til": atm, "belob": belob, "teller":ATMid})
				erBrugt = true
				return("du hævet: " + belob + "kr fra din konto")
			}
			else if(belob > 10000)
			{
				return("du kan ikke hæve over 10000kr")
			}
			else{return("kan ikke valider hævningen")}
		}
		else{throw("ERROR")}
	}
/*	
	that.udfor = function()
	{
		if(that.valider() == true)
		{
			fraKonto.udtraek(belob)
			tilKonto.indsaed(belob)
			Transaktioner.add({"fra": JSON.stringify(fraKonto), "til": JSON.stringify(tilKonto), "belob": belob, "ATM": ATMid})
			erBrugt = true;
			return("gik igemmen")
		}
		else{return("kan ikke valider")}
	}**/
	return(that)
}

var TellerMachine = function()
{
	var that = {}
	
	that.udfor = function(fraKonto, tilKonto, belob)
	{
		var o = Transaktion(fraKonto, tilKonto, belob, that)
		return(o.udfor())
	}
	return(that)
}

var ATM = function(id, saldo)
{
	var that = {}
	
	var id = id;
	var saldo = saldo;
	
	Object.defineProperty
	(
		that, "id",
		{
			"get":function()
			{
				return(id)
			},
			enumerable: true
		}
	)
		
	Object.defineProperty
	(
		that, "saldo", 
		{
			"get": function()
			{
				return(saldo)
			},
			enumerable: true
		}
	);
	
	that.udfor = function(kontoen, belob, indUd)
	{
		var o = ATMtransaktion(kontoen, that, belob, that)
		return(o.udfor(indUd))
	}
	
	that.udtraek = function(belob)
	{
		saldo = saldo - belob
	}
	
	that.validerUdtraek = function(belob)
	{
		if(saldo >= belob && belob > 0 && belob <= 10000)
		{
			return(true)
		}
		else{return(false)}
	}
	
	that.validerIndaet = function()
	{
		return(true)
	}
	
	return(that)
}

kontant = Konto(0000, 100, "kontant", 0);
hej = Konto(0001, 1000, "Jhon", 0.02);
hej2 = Konto(0002, 100, "Hansen", 0.04);
teller = TellerMachine();
