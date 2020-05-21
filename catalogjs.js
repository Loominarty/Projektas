$(document).ready(function(){
    var max_kaina = 0;
    var kaina_iki = 2000;
    var rodyti_prekiu = 12;
    var puslapiu = 1;
    var puslapis = 1;
    var $prekes = $(".it");
    if (location.hash.indexOf("#p") == 0){
        var numeris = parseInt(location.hash.replace("#p", ""));
        if (puslapis != numeris && numeris > 0){
            puslapis = numeris;
        }
    }
    function lygiuoti(){
        var max_aukstis = 0;

        $prekes.css("height", "auto");
        
        $prekes.each(function(){
            var $preke = $(this);
            max_aukstis = Math.max(max_aukstis, $preke.height());
        });
        max_aukstis = Math.ceil(max_aukstis);
        $prekes.css("height", max_aukstis);
    }

    function gautiZodzius(tekstas){

        tekstas = tekstas.replace(/[\,\:\;\.\|\+\-\*\/\(\)\{\}\[\]]/gi, ' ');
        
        tekstas = tekstas.toLowerCase();

        var txt1 = "ąčęėįšųūž";
        var txt2 = "aceeisuuz";
        for (var i = 0; i < txt1.length; i++) {
            tekstas = tekstas.replace(new RegExp(txt1[i], 'g'), txt2[i]);
        }
        var atrinkti_zodziai = tekstas.split(" ");
        atrinkti_zodziai = atrinkti_zodziai.filter(zodis=>zodis!='');
        return(atrinkti_zodziai);
    }
    function filtruoti(){
        $prekes.parent().show();
        var rodoma_prekiu = 0;
        $prekes.each(function(){
            var $preke = $(this);
            var preke_rodoma = true;
            if (parseFloat($preke.attr("kaina")) > kaina_iki){
                $preke.parent().hide();
                preke_rodoma = true;
            }
            if (zodziai.length > 0){
                var prekes_tekstas = $preke.find("h2").text();
                prekes_tekstas += " " + $preke.find("p").text();
                prekes_zodziai = gautiZodzius(prekes_tekstas);
                var rado = false;
                for (var i = 0; i < zodziai.length; i++) {
                    for (var j = 0; j < prekes_zodziai.length; j++) {
                        if (prekes_zodziai[j].indexOf(zodziai[i]) != -1){
                            rado = true;
                            break;
                        }
                    }
                    if (rado){
                        break;
                    }
                }
                if (rado == false){
                    $preke.parent().hide();
                    preke_rodoma = false;
                }
            }



            if (preke_rodoma){
                rodoma_prekiu++;                
            }
        });

        puslapiu = Math.ceil(rodoma_prekiu / rodyti_prekiu);
        if (puslapis > puslapiu) {
            puslapis = puslapiu;
            location.hash = "#p"+puslapis;
        }
        var nuo = (puslapis-1) * rodyti_prekiu + 1;
        var iki = puslapis * rodyti_prekiu;
        var i = 0;

        $prekes.each(function(){
            var $preke = $(this);
            if ($preke.parent().is(":visible")){
                i++;
                if (i < nuo || i > iki){
                    $preke.parent().hide();
                }
            }
        });
        var puslapiavimas = "";
        if (puslapiu > 1){
            if (puslapis == 1){
                puslapiavimas += '<li class="page-item disabled"><span class="page-link">Ankstesnis</span></li>';
            } else {
                puslapiavimas += '<li class="page-item"><a class="page-link" href="#p'+(puslapis - 1)+'">Ankstesnis</a></li>';
            }
            for (var i = 1; i <= puslapiu; i++) {
                if (i == puslapis){
                    puslapiavimas += '<li class="page-item active"><a class="page-link" href="#p'+i+'">'+i+'</a></li>';
                } else {
                    puslapiavimas += '<li class="page-item"><a class="page-link" href="#p'+i+'">'+i+'</a></li>';
                }
            } 
            if (puslapis == puslapiu){
                puslapiavimas += '<li class="page-item disabled"><span class="page-link">Sekantis</span></li>';
            } else {
                puslapiavimas += '<li class="page-item"><a class="page-link" href="#p'+(puslapis+1)+'">Sekantis</a></li>';
            }
        }
        $(".its .pagination").html(puslapiavimas);

        lygiuoti();
    }
    $( window ).on( 'hashchange', function( e ) {
        if (location.hash.indexOf("#p") == 0){
            var numeris = parseInt(location.hash.replace("#p", ""));
            if (puslapis != numeris && numeris > 0){
                puslapis = numeris;
                filtruoti();
            }
        }
    });
    $prekes.each(function(){
        var $preke = $(this);
        var $kaina = $preke.find(".kaina");
        var kaina = parseFloat($kaina.text().replace(",", "."));
        $preke.attr("kaina", kaina);
        max_kaina = Math.max(max_kaina, kaina);
    });
    max_kaina = Math.ceil(max_kaina)
    $("#kaina_iki_reiksme").text(max_kaina + ",00 EUR");
    kaina_iki = max_kaina;
    $("#kaina_iki").attr("max", max_kaina);
    $("#kaina_iki").attr("step", 1);

    $("#kaina_iki").change(function(){
        kaina_iki = $(this).val();
        $("#kaina_iki_reiksme").text(kaina_iki + ",00 EUR");
        
        filtruoti();
    });

    $('#rodyti_kategorija').change(function(){
        rodyti_kategorija = $(this).val();
        filtruoti();
      });

    $("#rodyti_prekiu").change(function(){
        rodyti_prekiu = $(this).val();

        
        filtruoti();
    });
    var zodziai = [];
    var $raktiniai_reiksmes = $("#raktiniai_reiksmes");
    $("#raktiniai").on('input', function() {
        var visas_tekstas = $(this).val();


        zodziai = gautiZodzius(visas_tekstas);

        $raktiniai_reiksmes.text(zodziai.join(" | "));

        
        filtruoti();
    });

    $(window).resize(function(){
        lygiuoti();
    });
    filtruoti();
});