function providers(){
	var providersView = Alloy.createController('serviceProviders').getView();
	providersView.open();
}

function incarceration(){
	var incarceratioinView = Alloy.createController('incarceration').getView();
	incarceratioinView.open();
}

function account(){
	var accountView = Alloy.createController('account').getView();
	accountView.open();
}

$.index.open();
