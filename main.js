//ユーザー名をcheaterにすると10億円スタート
//戻るボタンを押すと一日前に戻ります
//jsonでInfinityが使えないので、とりあえずint型の最大値にしました

const config = {
    initialPage:document.getElementById("initialPage"),
    mainPage:document.getElementById("mainPage")
};

const subParameter = {
    cache:[],
    intervalId:null
};

class UserAccount{
    constructor(name, age, days, money){
        this.name = name;
        this.age = age;
        this.days = days;
        this.money = money;
        this.clickCount = 0;
        this.items = [
            new Item("Flip machine", "ability", 1, 500, 25, 0, 15000, "https://media.istockphoto.com/photos/pan-or-metal-frying-pan-on-a-background-picture-id962282972?k=6&m=962282972&s=612x612&w=0&h=E5kRRXSzjFuGeTk7EddpEsQd5Z0WSmIn7oRFrM1ZUpo="),
            new Item("ETF Stock", "investment", 0, 2**32, 0, 0.01, 300000, "https://media.istockphoto.com/photos/business-trends-graphs-and-charts-picture-id1127138768?k=6&m=1127138768&s=612x612&w=0&h=dOHHS_dR1iu4tUK9vcX3_lxD69XKDJAcXM_YjwR8scY="),
            new Item("ETF Bonds", "investment", 0, 2**32, 0, 0.007, 300000, "https://media.istockphoto.com/photos/front-view-of-blue-growing-financial-chart-with-arrow-income-and-3d-picture-id1200937783?k=6&m=1200937783&s=612x612&w=0&h=WWYbnCRbH64ruWvmhVPuIfOL9iMvyiZd7W-qHGXCR-w="),
            new Item("Lemonade Stand", "realEstate", 0, 1000, 30, 0, 30000, "https://cdn.pixabay.com/photo/2018/08/15/18/07/energy-drink-3608733__480.jpg"),
            new Item("Ice Cream Truck", "realEstate", 0, 500, 120, 0, 100000, "https://media.istockphoto.com/photos/ice-cream-van-isolated-picture-id178825768?k=6&m=178825768&s=612x612&w=0&h=lM7l3TZft6Zo5XyKPjWqj-CVf7BesCGAOur88uv1AsI="),
            new Item("House", "realEstate", 0, 100, 32000, 0, 20000000, "https://cdn.pixabay.com/photo/2016/11/18/17/46/house-1836070__340.jpg"),
            new Item("TownHouse", "realEstate", 0, 100, 64000, 0, 40000000, "https://media.istockphoto.com/photos/modern-real-estate-picture-id488120139?b=1&k=6&m=488120139&s=170667a&w=0&h=hrlrd47GFLG18zhpF5W1tn7k9LpWj56GPIX45HoMcs0="),
            new Item("Mansion", "realEstate", 0, 20, 500000, 0, 250000000, "https://cdn.pixabay.com/photo/2018/03/13/14/53/architecture-3222705__480.jpg"),
            new Item("Industrial Space", "realEstate", 0, 10, 2200000, 0, 1000000000, "https://cdn.pixabay.com/photo/2017/01/16/08/06/factory-1983460__480.jpg"),
            new Item("Hotel Skyscraper", "realEstate", 0, 5, 25000000, 0, 10000000000, "https://media.istockphoto.com/photos/hawaii-hotels-at-waikiki-beach-picture-id827319750?k=6&m=827319750&s=612x612&w=0&h=U5rOaeq_yAD0e6j0PNFUOVOJdWuBagEPpAXh1dUiRGA="),
            new Item("Bullet-Speed Sky Railway", "realEstate", 0, 1, 30000000000, 0, 10000000000000, "https://media.istockphoto.com/photos/series-shinkansen-bullet-train-picture-id643393558?k=6&m=643393558&s=612x612&w=0&h=meKlua44cVRhH7H_tl-sBE5IuxRURH6hbJYC6pvSjUw=")
        ];
    }
}

class Item{
    constructor(name, type, currAmount, maxAmount, perMoney, perRate, price, url){
        this.name = name;
        this.type = type;
        this.currAmount = currAmount;
        this.maxAmount = maxAmount;
        this.perMoney =  perMoney;
        this.perRate = perRate;
        this.price = price;
        this.url = url;
    }
}

class Background{
    static getInitUserAcount(userName){
        let userMoney = userName=="cheater" ? 10**9 : 50000;
        return new UserAccount(userName, 20, 0, userMoney);
    }

    static getUserAccountFromLocal(userName){
        return JSON.parse(localStorage.getItem(userName));
    }

    static startTimer(user){
        subParameter.intervalId = setInterval(function(){ 
            Background.updateUserInfoPerDay(user);
            subParameter.cache.push(JSON.stringify(user));
            ViewControler.updateUserInfoView(user);
        }, 1000);
    }

    static stopTimer(){
        clearInterval(subParameter.intervalId);
        subParameter.cache = [];
        subParameter.intervalId = null;
    }

    static updateUserInfoPerDay(user){
        user.money += Background.getIncomePerDay(user);
        user.days++;
        user.age += user.days%365==0 ? 1 : 0;
    }

    static getIncomePerDay(user){
        let total = 0;
        let items = user.items;
        for(let i=0; i<items.length; i++){
            if(items[i].type=="realEstate"){
                total += items[i].perMoney * items[i].currAmount;
            }else if(items[i].type=="investment"){
                total += parseInt(items[i].perMoney*items[i].perRate/100);
            }
        }
        return total;
    }

    static updateUserInfoPerClick(user){
        user.money += Background.getIncomePerClick(user);
        for(let i=0; i<user.items.length; i++){
            if(user.items[i].type=="ability"){
                user.clickCount += user.items[i].currAmount;
            }
        }
    }

    static getIncomePerClick(user){
        let total = 0;
        for(let i=0; i<user.items.length; i++){
            if(user.items[i].type=="ability"){
                total += user.items[i].perMoney * user.items[i].currAmount;
            }
        }
        return total;
    }

    static getIncreasePerSecond(item){
        return item.type=="investment" ? (item.perRate+" %") : ("￥ "+Background.getDotNumber(item.perMoney));
    }

    static getDotNumber(num){
        if(num==0){return "0";}
        let numStr = "";
        let digit = 0;
        for(let curr=num; curr>0; curr=Math.floor(curr/10)){
            numStr = (curr%10) + (digit%3==0 ? "," : "") + numStr;
            digit++;
        }
        return numStr.substring(0,numStr.length-1);
    }

    static saveUserAccount(user){
        localStorage.setItem(user.name, JSON.stringify(user));
        alert("ユーザーデータを保存しました。\nログインする時には同じユーザー名を入力してください。\n履歴は自動的に削除されます。");
    }

    static backDataPerDay(user){//もう少しスマートに書きたかった
        let beforeUser = JSON.parse(subParameter.cache.pop())
        user.name = beforeUser.name;
        user.age = beforeUser.age;
        user.days = beforeUser.days;
        user.money = beforeUser.money;
        user.clickCount = beforeUser.clickCount;
        for(let i=0; i<user.items.length; i++){
            user.items[i].name = beforeUser.items[i].name;
            user.items[i].type = beforeUser.items[i].type;
            user.items[i].currAmount = beforeUser.items[i].currAmount;
            user.items[i].maxAmount = beforeUser.items[i].maxAmount;
            user.items[i].perMoney =  beforeUser.items[i].perMoney;
            user.items[i].perRate = beforeUser.items[i].perRate;
            user.items[i].price = beforeUser.items[i].price;
            user.items[i].url = beforeUser.items[i].url;
        }
    }

    static getTotalPrice(item, count){
        count = Number(count);//型変換、countがString型のため
        let total = 0;
        if(item.name=="ETF Stock"){
            let increaseRate = 0.1;
            for(let i=0; i<count; i++){
                total += parseInt(item.price * Math.pow(1+increaseRate,i));
            }
        }else if(count>0 && count%1==0){
            total = item.price * count;
        }
        return total;
    }

    static purchaseItems(user, itemIndex, count){
        count = Number(count);//型変換、countがString型のため
        if(count<=0 || isNaN(count) || count%1!=0){
            alert("自然数を入力してください。");
        }else if(user.money<Background.getTotalPrice(user.items[itemIndex], count)){
            alert("お金が足りません。");
        }else if(user.items[itemIndex].currAmount + count >user.items[itemIndex].maxAmount){
            alert("最大所持数を超えています。");
        }else{
            user.money -= Background.getTotalPrice(user.items[itemIndex], count);
            user.items[itemIndex].currAmount += count;
            if(user.items[itemIndex].name=="ETF Stock"){
                let increaseRate = 0.1;
                user.items[itemIndex].price = parseInt(user.items[itemIndex].price * Math.pow(1+increaseRate,count));
            }
            if(user.items[itemIndex].type=="investment"){
                user.items[itemIndex].perMoney += Background.getTotalPrice(user.items[itemIndex], count);
            }
        }
    }
}

class View{
    static createInitialPage(){
        let container = document.createElement("div");
        container.innerHTML =
        `
            <div class="bg-paleNavy pt-1 pb-1">
                <h1 class="text-white text-center">Clicker Empire Game</h1>
            </div>
            <div class="vh-100 d-flex justify-content-center align-items-center" id="setting">
                <div class="text-center text-warning ani-flash" id="flash">
                    <p class="fontSize-2rem">Start Game</p>
                    <p class="fontSize-1p5rem">(Please click here)</p>
                </div>      
            </div>
        `;
        let flash = container.querySelectorAll("#flash")[0];
        flash.addEventListener("click", function(){
            ViewControler.callStartMenu();
        });

        return container;
    }

    static createStartMenu(){
        let container = document.createElement("div");
        container.classList.add("bg-white", "p-3", "col-8", "col-sm-6", "col-md-4");
        container.innerHTML =
        `
            <h4 class="text-center mb-3">Start Menu</h4>
            <input type="text" placeholder="User Name" class="form-control mb-3 col-12">
            <button type="button" class="btn btn-outline-primary col-12 mb-3" id="newGame">New Game</button>
            <button type="button" class="btn btn-primary col-12 mb-3" id="login">Login</button> 
        `;

        let newGameBtn = container.querySelectorAll("#newGame")[0];
        newGameBtn.addEventListener("click", function(){
            let userName = container.querySelectorAll("input")[0].value;
            if(userName==""){
                alert("ユーザー名が入力されていません。");
            }else{
                let user = Background.getInitUserAcount(userName);
                ViewControler.accessMainPage(user);
                Background.startTimer(user);
            }
        });

        let loginBtn = container.querySelectorAll("#login")[0];
        loginBtn.addEventListener("click", function(){
            let userName = container.querySelectorAll("input")[0].value;
            if(userName==""){
                alert("ユーザー名が入力されていません。")
            }else{
                let user = Background.getUserAccountFromLocal(userName);
                if(user==null){
                    alert("データが保存されていません。");
                }else{
                    ViewControler.accessMainPage(user);
                    Background.startTimer(user);
                }     
            }  
        });

        return container;
    }

    static createMainPage(user){
        let container = document.createElement("div");
        container.innerHTML =
        `
            <div class="d-flex justify-content-center p-md-5 pb-5">
                <div class="bg-paleNavy p-2 d-flex col-md-11 col-lg-10 h-35rem">
                    <div class="bg-dark p-2 col-4" id="ability">
                    </div>

                    <div class="col-8">
                        <div class="bg-paleNavy p-1" id="userCard">               
                        </div>

                        <div class="bg-dark mt-2 p-1 overflow-auto flowHeight" id="itemDisplay">                              
                        </div>
                        <div class="mt-2 d-flex justify-content-end">
                            <div class="border p-2 mr-2 hover" id="return">
                                <i class="fas fa-undo fa-2x text-white"></i>
                            </div>
                            <div class="border p-2 hover" id="save">
                                <i class="fas fa-save fa-2x text-white"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        container.querySelectorAll("#userCard")[0].append(View.createUserCardPage(user));
        container.querySelectorAll("#ability")[0].append(View.createClickAbilityPage(user));
        container.querySelectorAll("#itemDisplay")[0].append(View.createSelectItemPage(user));

        let returnBtn = container.querySelectorAll("#return")[0];
        returnBtn.addEventListener("click", function(){
            if(subParameter.cache.length==0){
                alert("履歴がありません。");
            }else{
                Background.backDataPerDay(user);
                ViewControler.updateUserInfoView(user);
                ViewControler.updateItemInfoView(user);
            }
        });

        let saveBtn = container.querySelectorAll("#save")[0];
        saveBtn.addEventListener("click", function(){
            Background.saveUserAccount(user);
            Background.stopTimer();
            ViewControler.accessInitPage();
        });

        return container;
    }

    static createClickAbilityPage(user){
        let container = document.createElement("div");
        container.innerHTML = 
        `
            <div class="bg-paleNavy text-white text-center">
                <p class="fontSize-1p3rem">${Background.getDotNumber(user.clickCount)} Burgers</p>
                <p>￥${Background.getDotNumber(Background.getIncomePerClick(user))} per second</p>
            </div>
            <div class="p-2 pt-5 d-flex justify-content-center" id="burger">
                <img src="https://cdn.pixabay.com/photo/2012/04/14/15/37/cheeseburger-34315__480.png" class="img-fluid hover col-md-10 d-block">
            </div>
        `;
        
        let burgerBtn = container.querySelectorAll("#burger")[0];
        burgerBtn.addEventListener("click", function(){
            Background.updateUserInfoPerClick(user);
            ViewControler.updateUserInfoView(user);
        });

        return container;
    }

    static createUserCardPage(user){
        let container = document.createElement("div");
        container.classList.add("d-flex", "flex-wrap");
        container.innerHTML =
        `
            <div class="text-white text-center col-12 col-sm-6 userInfoBorder">
                <p>${user.name}</p>
            </div>
            <div class="text-white text-center col-12 col-sm-6 userInfoBorder">
                <p>${user.age} yrs old</p>
            </div>
            <div class="text-white text-center col-12 col-sm-6 userInfoBorder">
                <p>${Background.getDotNumber(user.days)}days</p>
            </div>
            <div class="text-white text-center col-12 col-sm-6 userInfoBorder">
                <p>￥${Background.getDotNumber(user.money)}</p>
            </div>
        `;
        return container;
    }

    static createSelectItemPage(user){
        let container = document.createElement("div");
        container.id = "selectItemPage";
        for(let i=0; i<user.items.length; i++){
            container.innerHTML +=
            `
                <div class="bg-paleNavy text-white d-sm-flex align-items-center m-1 selectItem">
                    <div class="d-none d-sm-block p-1 col-sm-3">
                        <img src="${user.items[i].url}" class="img-fluid">
                    </div>
                    <div class="col-sm-9">
                        <div class="d-flex justify-content-between">
                            <p>${user.items[i].name}</p>
                            <p>${Background.getDotNumber(user.items[i].currAmount)}</p>
                        </div>
                        <div class="d-flex justify-content-between">
                            <p class="fontSize-0p8rem">￥${Background.getDotNumber(user.items[i].price)}</p>
                            <p class="text-success fontSize-0p8rem">+${Background.getIncreasePerSecond(user.items[i])}/sec</p>
                        </div>
                    </div>
                </div>
            `;
        }

        let itemEles = container.querySelectorAll(".selectItem");
        for(let i=0; i<itemEles.length; i++){
            itemEles[i].addEventListener("click", function(){
                config.mainPage.querySelectorAll("#itemDisplay")[0].innerHTML = ``;
                config.mainPage.querySelectorAll("#itemDisplay")[0].append(View.createPurchaseItemPage(user, i));
            });
            itemEles[i].addEventListener("mouseover", function(){
                itemEles[i].classList.add("selectBorder");
            });
            itemEles[i].addEventListener("mouseout", function(){
                itemEles[i].classList.remove("selectBorder");
            });
        }

        return container;
    }

    static createPurchaseItemPage(user, index){
        let container = document.createElement("div");
        container.id = index; //履歴で一日戻る描写の前処理
        container.classList.add("itemMark"); //履歴で戻る描写の印
        container.innerHTML = 
        `
            <div class="bg-paleNavy p-2 m-1 text-white">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <p class="fontSize-1p3rem">${user.items[index].name}</p>
                            <p>Max Purchase: ${Background.getDotNumber(user.items[index].maxAmount)}</p>
                            <p>Price: ￥${Background.getDotNumber(user.items[index].price)}</p>
                            <p>Get ${Background.getIncreasePerSecond(user.items[index])} extra yen per second</p>
                    </div>
                    <div class="p-2 d-none d-sm-block col-sm-5">
                        <img src="${user.items[index].url}" class="img-fluid">
                    </div>
                </div>
                <p>How Many would you like to purchase?</p>
                <input type="number" placeholder="0" class="col-12 form-control">
                <p class="text-right" id="totalPrice">total : ￥0</p>
                <div class="d-flex justify-content-between">
                    <button class="btn btn-outline-primary col-5 bg-light" id="back">Go Back</button>
                    <button class="btn btn-primary col-5" id="purchase">Purchase</button>
                </div>
            </div>
        `;

        let inputCount = container.querySelectorAll("input")[0];
        inputCount.addEventListener("input", function(){
            container.querySelectorAll("#totalPrice")[0].innerHTML = 
            `
                total : ￥${Background.getDotNumber(Background.getTotalPrice(user.items[index], inputCount.value))}
            `;
        });

        let backBtn = container.querySelectorAll("#back")[0];
        backBtn.addEventListener("click", function(){
            ViewControler.accessMainPage(user);
        });

        let purchaseBtn = container.querySelectorAll("#purchase")[0];
        purchaseBtn.addEventListener("click", function(){
            Background.purchaseItems(user, index, inputCount.value);
            ViewControler.accessMainPage(user);
        });

        return container;
    }
}

class ViewControler{
    static accessInitPage(){
        config.initialPage.innerHTML = ``;
        config.mainPage.innerHTML = ``;
        config.initialPage.append(View.createInitialPage());
    }
    
    static callStartMenu(){
        config.initialPage.querySelectorAll("#setting")[0].innerHTML = ``;
        config.initialPage.querySelectorAll("#setting")[0].append(View.createStartMenu());
    }

    static accessMainPage(user){
        config.initialPage.innerHTML = ``;
        config.mainPage.innerHTML = ``;
        config.mainPage.append(View.createMainPage(user))
    }

    static updateUserInfoView(user){
        config.mainPage.querySelectorAll("#ability")[0].innerHTML = ``;
        config.mainPage.querySelectorAll("#ability")[0].append(View.createClickAbilityPage(user));
        config.mainPage.querySelectorAll("#userCard")[0].innerHTML = '';
        config.mainPage.querySelectorAll("#userCard")[0].append(View.createUserCardPage(user));
    }

    static updateItemInfoView(user){//少しややこしい処理
        let itemDisplay = config.mainPage.querySelectorAll("#itemDisplay")[0];
        if(config.mainPage.querySelectorAll("#selectItemPage").length==1){
            itemDisplay.innerHTML = ``;
            itemDisplay.append(View.createSelectItemPage(user));
        }else{
            let itemIndex = parseInt(itemDisplay.querySelectorAll(".itemMark")[0].id)
            itemDisplay.innerHTML = ``;
            itemDisplay.append(View.createPurchaseItemPage(user, itemIndex));
        }
    }
}

//ゲームを起動
function launchGame(){
    ViewControler.accessInitPage();
}
launchGame();