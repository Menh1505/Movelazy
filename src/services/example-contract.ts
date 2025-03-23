export function coin_example(name: string): string {
    return `module ${name}::moon_coin {
    struct MoonCoin {}

    fun init_module(sender: &signer) {
        aptos_framework::managed_coin::initialize<MoonCoin>(
            sender,
            b"Moon Coin",
            b"MOON",
            6,
            false,
        );
    }
}`;
}

export function nft_example(name: string): string {
    return `module ${name}::marketplace {
        use std::error;
        use std::signer;
        use std::option;
        use aptos_std::smart_vector;
        use aptos_framework::aptos_account;
        use aptos_framework::coin;
        use aptos_framework::object;

        #[test_only]
        friend marketplace_addr::test_marketplace;

        const APP_OBJECT_SEED: vector<u8> = b"MARKETPLACE";

        const ENO_LISTING: u64 = 1;
        const ENO_SELLER: u64 = 2;

        struct MarketplaceSigner has key {
            extend_ref: object::ExtendRef,
        }

        struct Sellers has key {
            addresses: smart_vector::SmartVector<address>
        }

        #[resource_group_member(group = aptos_framework::object::ObjectGroup)]
        struct Listing has key {
            object: object::Object<object::ObjectCore>,
            seller: address,
            delete_ref: object::DeleteRef,
            extend_ref: object::ExtendRef,
        }

        #[resource_group_member(group = aptos_framework::object::ObjectGroup)]
        struct FixedPriceListing<phantom CoinType> has key {
            price: u64,
        }

        struct SellerListings has key {
            listings: smart_vector::SmartVector<address>
        }

        fun init_module(deployer: &signer) {
            let constructor_ref = object::create_named_object(
                deployer,
                APP_OBJECT_SEED,
            );
            let extend_ref = object::generate_extend_ref(&constructor_ref);
            let marketplace_signer = &object::generate_signer(&constructor_ref);

            move_to(marketplace_signer, MarketplaceSigner {
                extend_ref,
            });
        }

        public entry fun list_with_fixed_price<CoinType>(
            seller: &signer,
            object: object::Object<object::ObjectCore>,
            price: u64,
        ) acquires SellerListings, Sellers, MarketplaceSigner {
            list_with_fixed_price_internal<CoinType>(seller, object, price);
        }

        public entry fun purchase<CoinType>(
            purchaser: &signer,
            object: object::Object<object::ObjectCore>,
        ) acquires FixedPriceListing, Listing, SellerListings, Sellers {
            let listing_addr = object::object_address(&object);

            assert!(exists<Listing>(listing_addr), error::not_found(ENO_LISTING));
            assert!(exists<FixedPriceListing<CoinType>>(listing_addr), error::not_found(ENO_LISTING));

            let FixedPriceListing {
                price,
            } = move_from<FixedPriceListing<CoinType>>(listing_addr);

            let coins = coin::withdraw<CoinType>(purchaser, price);

            let Listing {
                object,
                seller,
                delete_ref,
                extend_ref,
            } = move_from<Listing>(listing_addr);

            let obj_signer = object::generate_signer_for_extending(&extend_ref);
            object::transfer(&obj_signer, object, signer::address_of(purchaser));
            object::delete(delete_ref);

            let seller_listings = borrow_global_mut<SellerListings>(seller);
            let (exist, idx) = smart_vector::index_of(&seller_listings.listings, &listing_addr);
            assert!(exist, error::not_found(ENO_LISTING));
            smart_vector::remove(&mut seller_listings.listings, idx);

            if (smart_vector::length(&seller_listings.listings) == 0) {
                let sellers = borrow_global_mut<Sellers>(get_marketplace_signer_addr());
                let (exist, idx) = smart_vector::index_of(&sellers.addresses, &seller);
                assert!(exist, error::not_found(ENO_SELLER));
                smart_vector::remove(&mut sellers.addresses, idx);
            };

            aptos_account::deposit_coins(seller, coins);
        }

        public(friend) fun list_with_fixed_price_internal<CoinType>(
            seller: &signer,
            object: object::Object<object::ObjectCore>,
            price: u64,        
        ): object::Object<Listing> acquires SellerListings, Sellers, MarketplaceSigner {
            let constructor_ref = object::create_object(signer::address_of(seller));

            let transfer_ref = object::generate_transfer_ref(&constructor_ref);
            object::disable_ungated_transfer(&transfer_ref);

            let listing_signer = object::generate_signer(&constructor_ref);

            let listing = Listing {
                object,
                seller: signer::address_of(seller),
                delete_ref: object::generate_delete_ref(&constructor_ref),
                extend_ref: object::generate_extend_ref(&constructor_ref),
            };
            let fixed_price_listing = FixedPriceListing<CoinType> {
                price,
            };
            move_to(&listing_signer, listing);
            move_to(&listing_signer, fixed_price_listing);

            object::transfer(seller, object, signer::address_of(&listing_signer));

            let listing = object::object_from_constructor_ref(&constructor_ref);

            if (exists<SellerListings>(signer::address_of(seller))) {
                let seller_listings = borrow_global_mut<SellerListings>(signer::address_of(seller));
                smart_vector::push_back(&mut seller_listings.listings, object::object_address(&listing));
            } else {
                let seller_listings = SellerListings {
                    listings: smart_vector::new(),
                };
                smart_vector::push_back(&mut seller_listings.listings, object::object_address(&listing));
                move_to(seller, seller_listings);
            };
            if (exists<Sellers>(get_marketplace_signer_addr())) {
                let sellers = borrow_global_mut<Sellers>(get_marketplace_signer_addr());
                if (!smart_vector::contains(&sellers.addresses, &signer::address_of(seller))) {
                    smart_vector::push_back(&mut sellers.addresses, signer::address_of(seller));
                }
            } else {
                let sellers = Sellers {
                    addresses: smart_vector::new(),
                };
                smart_vector::push_back(&mut sellers.addresses, signer::address_of(seller));
                move_to(&get_marketplace_signer(get_marketplace_signer_addr()), sellers);
            };

            listing
        }

        #[view]
        public fun price<CoinType>(
            object: object::Object<Listing>,
        ): option::Option<u64> acquires FixedPriceListing {
            let listing_addr = object::object_address(&object);
            if (exists<FixedPriceListing<CoinType>>(listing_addr)) {
                let fixed_price = borrow_global<FixedPriceListing<CoinType>>(listing_addr);
                option::some(fixed_price.price)
            } else {
                assert!(false, error::not_found(ENO_LISTING));
                option::none()
            }
        }

        #[view]
        public fun listing(object: object::Object<Listing>): (object::Object<object::ObjectCore>, address) acquires Listing {
            let listing = borrow_listing(object);
            (listing.object, listing.seller)
        }

        #[view]
        public fun get_seller_listings(seller: address): vector<address> acquires SellerListings {
            if (exists<SellerListings>(seller)) {
                smart_vector::to_vector(&borrow_global<SellerListings>(seller).listings)
            } else {
                vector[]
            }
        }

        #[view]
        public fun get_sellers(): vector<address> acquires Sellers {
            if (exists<Sellers>(get_marketplace_signer_addr())) {
                smart_vector::to_vector(&borrow_global<Sellers>(get_marketplace_signer_addr()).addresses)
            } else {
                vector[]
            }
        }

        #[test_only]
        public fun setup_test(marketplace: &signer) {
            init_module(marketplace);
        }

        fun get_marketplace_signer_addr(): address {
            object::create_object_address(&@0x1, APP_OBJECT_SEED)
        }

        fun get_marketplace_signer(marketplace_signer_addr: address): signer acquires MarketplaceSigner {
            object::generate_signer_for_extending(&borrow_global<MarketplaceSigner>(marketplace_signer_addr).extend_ref)
        }

        inline fun borrow_listing(object: object::Object<Listing>): &Listing acquires Listing {
            let obj_addr = object::object_address(&object);
            assert!(exists<Listing>(obj_addr), error::not_found(ENO_LISTING));
            borrow_global<Listing>(obj_addr)
        }
    }

    #[test_only]
    module ${name}::test_marketplace {
        use std::option;
        use aptos_framework::aptos_coin;
        use aptos_framework::coin;
        use aptos_framework::object;
        use aptos_token_objects::token;
        use marketplace_addr::marketplace;
        use marketplace_addr::test_utils;

        #[test(aptos_framework = @0x1, marketplace = @0x111, seller = @0x222, purchaser = @0x333)]
        fun test_fixed_price(
            aptos_framework: &signer,
            marketplace: &signer,
            seller: &signer,
            purchaser: &signer,
        ) {
            let (_marketplace_addr, seller_addr, purchaser_addr) =
                test_utils::setup(aptos_framework, marketplace, seller, purchaser);

            let (token, listing) = fixed_price_listing(seller, 500);

            let (listing_obj, seller_addr2) = marketplace::listing(listing);
            assert!(listing_obj == object::convert(token), 0);
            assert!(seller_addr2 == seller_addr, 0);
            assert!(marketplace::price<aptos_coin::AptosCoin>(listing) == option::some(500), 0);
            assert!(object::owner(token) == object::object_address(&listing), 0);

            marketplace::purchase<aptos_coin::AptosCoin>(purchaser, object::convert(listing));

            assert!(object::owner(token) == purchaser_addr, 0);
            assert!(coin::balance<aptos_coin::AptosCoin>(seller_addr) == 10500, 0);
            assert!(coin::balance<aptos_coin::AptosCoin>(purchaser_addr) == 9500, 0);
        }

        #[test(aptos_framework = @0x1, marketplace = @0x111, seller = @0x222, purchaser = @0x333)]
        #[expected_failure(abort_code = 0x10006, location = aptos_framework::coin)]
        fun test_not_enough_coin_fixed_price(
            aptos_framework: &signer,
            marketplace: &signer,
            seller: &signer,
            purchaser: &signer,
        ) {
            test_utils::setup(aptos_framework, marketplace, seller, purchaser);

            let (_token, listing) = fixed_price_listing(seller, 100000);

            marketplace::purchase<aptos_coin::AptosCoin>(purchaser, object::convert(listing));
        }

        #[test(aptos_framework = @0x1, marketplace = @0x111, seller = @0x222, purchaser = @0x333)]
        #[expected_failure(abort_code = 0x60001, location = marketplace_addr::marketplace)]
        fun test_no_listing(
            aptos_framework: &signer,
            marketplace: &signer,
            seller: &signer,
            purchaser: &signer,
        ) {
            let (_, seller_addr, _) = test_utils::setup(aptos_framework, marketplace, seller, purchaser);

            let dummy_constructor_ref = object::create_object(seller_addr);
            let dummy_object = object::object_from_constructor_ref<object::ObjectCore>(&dummy_constructor_ref);

            marketplace::purchase<aptos_coin::AptosCoin>(purchaser, object::convert(dummy_object));
        }

        inline fun fixed_price_listing(
            seller: &signer,
            price: u64
        ): (object::Object<token::Token>, object::Object<marketplace::Listing>) {
            let token = test_utils::mint_tokenv2(seller);
            fixed_price_listing_with_token(seller, token, price)
        }

        inline fun fixed_price_listing_with_token(
            seller: &signer,
            token: object::Object<token::Token>,
            price: u64
        ): (object::Object<token::Token>, object::Object<marketplace::Listing>) {
            let listing = marketplace::list_with_fixed_price_internal<aptos_coin::AptosCoin>(
                seller,
                object::convert(token),
                price,
            );
            (token, listing)
        }
    }`;
}

export function todo_example(name: string): string {
    return `module ${name}::advanced_todo_list {
    use std::bcs;
    use std::signer;
    use std::vector;
    use std::string::String;
    use aptos_std::string_utils;
    use aptos_framework::object;

    const E_TODO_LIST_DOSE_NOT_EXIST: u64 = 1;
    const E_TODO_DOSE_NOT_EXIST: u64 = 2;
    const E_TODO_ALREADY_COMPLETED: u64 = 3;

    struct UserTodoListCounter has key {
        counter: u64,
    }

    struct TodoList has key {
        owner: address,
        todos: vector<Todo>,
    }

    struct Todo has store, drop, copy {
        content: String,
        completed: bool,
    }

    fun init_module(_module_publisher: &signer) {
    }

    public entry fun create_todo_list(sender: &signer) acquires UserTodoListCounter {
        let sender_address = signer::address_of(sender);
        let counter = if (exists<UserTodoListCounter>(sender_address)) {
            let counter = borrow_global<UserTodoListCounter>(sender_address);
            counter.counter
        } else {
            let counter = UserTodoListCounter { counter: 0 };
            move_to(sender, counter);
            0
        };
        let obj_holds_todo_list = object::create_named_object(
            sender,
            construct_todo_list_object_seed(counter),
        );
        let obj_signer = object::generate_signer(&obj_holds_todo_list);
        let todo_list = TodoList {
            owner: sender_address,
            todos: vector::empty(),
        };
        move_to(&obj_signer, todo_list);
        let counter = borrow_global_mut<UserTodoListCounter>(sender_address);
        counter.counter = counter.counter + 1;
    }

    public entry fun create_todo(sender: &signer, todo_list_idx: u64, content: String) acquires TodoList {
        let sender_address = signer::address_of(sender);
        let todo_list_obj_addr = object::create_object_address(
            &sender_address,
            construct_todo_list_object_seed(todo_list_idx)
        );
        assert_user_has_todo_list(todo_list_obj_addr);
        let todo_list = borrow_global_mut<TodoList>(todo_list_obj_addr);
        let new_todo = Todo {
            content,
            completed: false
        };
        vector::push_back(&mut todo_list.todos, new_todo);
    }

    public entry fun complete_todo(sender: &signer, todo_list_idx: u64, todo_idx: u64) acquires TodoList {
        let sender_address = signer::address_of(sender);
        let todo_list_obj_addr = object::create_object_address(
            &sender_address,
            construct_todo_list_object_seed(todo_list_idx)
        );
        assert_user_has_todo_list(todo_list_obj_addr);
        let todo_list = borrow_global_mut<TodoList>(todo_list_obj_addr);
        assert_user_has_given_todo(todo_list, todo_idx);
        let todo_record = vector::borrow_mut(&mut todo_list.todos, todo_idx);
        assert!(todo_record.completed == false, E_TODO_ALREADY_COMPLETED);
        todo_record.completed = true;
    }

    #[view]
    public fun get_todo_list_counter(sender: address): u64 acquires UserTodoListCounter {
        if (exists<UserTodoListCounter>(sender)) {
            let counter = borrow_global<UserTodoListCounter>(sender);
            counter.counter
        } else {
            0
        }
    }

    #[view]
    public fun get_todo_list_obj_addr(sender: address, todo_list_idx: u64): address {
        object::create_object_address(&sender, construct_todo_list_object_seed(todo_list_idx))
    }

    #[view]
    public fun has_todo_list(sender: address, todo_list_idx: u64): bool {
        let todo_list_obj_addr = get_todo_list_obj_addr(sender, todo_list_idx);
        exists<TodoList>(todo_list_obj_addr)
    }

    #[view]
    public fun get_todo_list(sender: address, todo_list_idx: u64): (address, u64) acquires TodoList {
        let todo_list_obj_addr = get_todo_list_obj_addr(sender, todo_list_idx);
        assert_user_has_todo_list(todo_list_obj_addr);
        let todo_list = borrow_global<TodoList>(todo_list_obj_addr);
        (todo_list.owner, vector::length(&todo_list.todos))
    }

    #[view]
    public fun get_todo_list_by_todo_list_obj_addr(todo_list_obj_addr: address): (address, u64) acquires TodoList {
        let todo_list = borrow_global<TodoList>(todo_list_obj_addr);
        (todo_list.owner, vector::length(&todo_list.todos))
    }

    #[view]
    public fun get_todo(sender: address, todo_list_idx: u64, todo_idx: u64): (String, bool) acquires TodoList {
        let todo_list_obj_addr = get_todo_list_obj_addr(sender, todo_list_idx);
        assert_user_has_todo_list(todo_list_obj_addr);
        let todo_list = borrow_global<TodoList>(todo_list_obj_addr);
        assert!(todo_idx < vector::length(&todo_list.todos), E_TODO_DOSE_NOT_EXIST);
        let todo_record = vector::borrow(&todo_list.todos, todo_idx);
        (todo_record.content, todo_record.completed)
    }

    fun assert_user_has_todo_list(user_addr: address) {
        assert!(
            exists<TodoList>(user_addr),
            E_TODO_LIST_DOSE_NOT_EXIST
        );
    }

    fun assert_user_has_given_todo(todo_list: &TodoList, todo_id: u64) {
        assert!(
            todo_id < vector::length(&todo_list.todos),
            E_TODO_DOSE_NOT_EXIST
        );
    }

    fun get_todo_list_obj(sender: address, todo_list_idx: u64): object::Object<TodoList> {
        let addr = get_todo_list_obj_addr(sender, todo_list_idx);
        object::address_to_object(addr)
    }

    fun construct_todo_list_object_seed(counter: u64): vector<u8> {
        bcs::to_bytes(&string_utils::format2(&b"{}_{}", @0x1, counter))
    }

    #[test_only]
    use std::string;
    #[test_only]
    use aptos_framework::account;
    #[test_only]
    use aptos_std::debug;

    #[test(admin = @0x100)]
    public entry fun test_end_to_end(admin: signer) acquires TodoList, UserTodoListCounter {
        let admin_addr = signer::address_of(&admin);
        let todo_list_idx = get_todo_list_counter(admin_addr);
        assert!(todo_list_idx == 0, 1);
        account::create_account_for_test(admin_addr);
        assert!(!has_todo_list(admin_addr, todo_list_idx), 2);
        create_todo_list(&admin);
        assert!(get_todo_list_counter(admin_addr) == 1, 3);
        assert!(has_todo_list(admin_addr, todo_list_idx), 4);

        create_todo(&admin, todo_list_idx, string::utf8(b"New Todo"));
        let (todo_list_owner, todo_list_length) = get_todo_list(admin_addr, todo_list_idx);
        debug::print(&string_utils::format1(&b"todo_list_owner: {}", todo_list_owner));
        debug::print(&string_utils::format1(&b"todo_list_length: {}", todo_list_length));
        assert!(todo_list_owner == admin_addr, 5);
        assert!(todo_list_length == 1, 6);

        let (todo_content, todo_completed) = get_todo(admin_addr, todo_list_idx, 0);
        debug::print(&string_utils::format1(&b"todo_content: {}", todo_content));
        debug::print(&string_utils::format1(&b"todo_completed: {}", todo_completed));
        assert!(!todo_completed, 7);
        assert!(todo_content == string::utf8(b"New Todo"), 8);

        complete_todo(&admin, todo_list_idx, 0);
        let (_todo_content, todo_completed) = get_todo(admin_addr, todo_list_idx, 0);
        debug::print(&string_utils::format1(&b"todo_completed: {}", todo_completed));
        assert!(todo_completed, 9);
    }

    #[test(admin = @0x100)]
    public entry fun test_end_to_end_2_todo_lists(admin: signer) acquires TodoList, UserTodoListCounter {
        let admin_addr = signer::address_of(&admin);
        create_todo_list(&admin);
        let todo_list_1_idx = get_todo_list_counter(admin_addr) - 1;
        create_todo_list(&admin);
        let todo_list_2_idx = get_todo_list_counter(admin_addr) - 1;

        create_todo(&admin, todo_list_1_idx, string::utf8(b"New Todo"));
        let (todo_list_owner, todo_list_length) = get_todo_list(admin_addr, todo_list_1_idx);
        assert!(todo_list_owner == admin_addr, 1);
        assert!(todo_list_length == 1, 2);

        let (todo_content, todo_completed) = get_todo(admin_addr, todo_list_1_idx, 0);
        assert!(!todo_completed, 3);
        assert!(todo_content == string::utf8(b"New Todo"), 4);

        complete_todo(&admin, todo_list_1_idx, 0);
        let (_todo_content, todo_completed) = get_todo(admin_addr, todo_list_1_idx, 0);
        assert!(todo_completed, 5);

        create_todo(&admin, todo_list_2_idx, string::utf8(b"New Todo"));
        let (todo_list_owner, todo_list_length) = get_todo_list(admin_addr, todo_list_2_idx);
        assert!(todo_list_owner == admin_addr, 6);
        assert!(todo_list_length == 1, 7);

        let (todo_content, todo_completed) = get_todo(admin_addr, todo_list_2_idx, 0);
        assert!(!todo_completed, 8);
        assert!(todo_content == string::utf8(b"New Todo"), 9);

        complete_todo(&admin, todo_list_2_idx, 0);
        let (_todo_content, todo_completed) = get_todo(admin_addr, todo_list_2_idx, 0);
        assert!(todo_completed, 10);
    }

    #[test(admin = @0x100)]
    #[expected_failure(abort_code = E_TODO_LIST_DOSE_NOT_EXIST, location = Self)]
    public entry fun test_todo_list_does_not_exist(admin: signer) acquires TodoList, UserTodoListCounter {
        let admin_addr = signer::address_of(&admin);
        account::create_account_for_test(admin_addr);
        let todo_list_idx = get_todo_list_counter(admin_addr);
        create_todo(&admin, todo_list_idx, string::utf8(b"New Todo"));
    }

    #[test(admin = @0x100)]
    #[expected_failure(abort_code = E_TODO_DOSE_NOT_EXIST, location = Self)]
    public entry fun test_todo_does_not_exist(admin: signer) acquires TodoList, UserTodoListCounter {
        let admin_addr = signer::address_of(&admin);
        account::create_account_for_test(admin_addr);
        let todo_list_idx = get_todo_list_counter(admin_addr);
        create_todo_list(&admin);
        complete_todo(&admin, todo_list_idx, 1);
    }

    #[test(admin = @0x100)]
    #[expected_failure(abort_code = E_TODO_ALREADY_COMPLETED, location = Self)]
    public entry fun test_todo_already_completed(admin: signer) acquires TodoList, UserTodoListCounter {
        let admin_addr = signer::address_of(&admin);
        account::create_account_for_test(admin_addr);
        let todo_list_idx = get_todo_list_counter(admin_addr);
        create_todo_list(&admin);
        create_todo(&admin, todo_list_idx, string::utf8(b"New Todo"));
        complete_todo(&admin, todo_list_idx, 0);
        complete_todo(&admin, todo_list_idx, 0);
    }
}`;
}

export function prover_example(name: string): string {
    return `module ${name}::prove {
    fun plus1(x: u64): u64 {
        x+1
    }
    spec plus1 {
        ensures result == x+1;
    }

    fun abortsIf0(x: u64) {
        if (x == 0) {
            abort(0)
        };
    }
    spec abortsIf0 {
        aborts_if x == 0;
    }
}`;
}