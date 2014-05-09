describe("{%= name %}", function(){
    describe("{%= name %}.my_method()", function(){
        it("should return 1", function(done){
            _use('{%= name %}@latest', function(exports) {
                expect('my_method' in exports);
                done();
            });
        });
    });
});