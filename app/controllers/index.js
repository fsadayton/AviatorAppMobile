function providers(){
	var providerListView = Alloy.createController('providerList').getView();
	providerListView.open();
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
